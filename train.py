import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from torchvision import transforms
from pathlib import Path
import numpy as np
from tqdm import tqdm

from config import Config
from dataset import ForgeryDataset
from model import UNet
from utils import save_checkpoint, ensure_dir

def train_model():
    # Create directories
    ensure_dir(Config.DATA_ROOT)
    ensure_dir('checkpoints')
    
    # Set device
    device = torch.device(Config.DEVICE if torch.cuda.is_available() else 'cpu')
    
    # Data transforms
    transform = transforms.Compose([
        transforms.Resize((Config.IMAGE_SIZE, Config.IMAGE_SIZE)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], 
                           std=[0.229, 0.224, 0.225])
    ])
    
    # Create dataset and dataloader
    dataset = ForgeryDataset(Config.DATA_ROOT, mode='train', transform=transform)
    train_size = int((1 - Config.VAL_SPLIT) * len(dataset))
    val_size = len(dataset) - train_size
    train_dataset, val_dataset = torch.utils.data.random_split(
        dataset, [train_size, val_size]
    )
    
    train_loader = DataLoader(
        train_dataset, 
        batch_size=Config.BATCH_SIZE,
        shuffle=True,
        num_workers=4
    )
    
    val_loader = DataLoader(
        val_dataset,
        batch_size=Config.BATCH_SIZE,
        shuffle=False,
        num_workers=4
    )
    
    # Initialize model, loss function, and optimizer
    model = UNet(Config.INPUT_CHANNELS, Config.OUTPUT_CHANNELS).to(device)
    criterion = nn.BCELoss()
    optimizer = optim.Adam(model.parameters(), lr=Config.LEARNING_RATE)
    
    # Training loop
    best_val_loss = float('inf')
    
    for epoch in range(Config.NUM_EPOCHS):
        model.train()
        train_loss = 0
        
        with tqdm(train_loader, desc=f'Epoch {epoch+1}/{Config.NUM_EPOCHS}') as pbar:
            for images, masks, is_forged in pbar:
                images = images.to(device)
                masks = masks.to(device)
                
                # Forward pass
                outputs = model(images)
                loss = criterion(outputs, masks.unsqueeze(1))
                
                # Backward pass and optimize
                optimizer.zero_grad()
                loss.backward()
                optimizer.step()
                
                train_loss += loss.item()
                pbar.set_postfix({'loss': loss.item()})
        
        # Validation
        model.eval()
        val_loss = 0
        
        with torch.no_grad():
            for images, masks, is_forged in val_loader:
                images = images.to(device)
                masks = masks.to(device)
                
                outputs = model(images)
                loss = criterion(outputs, masks.unsqueeze(1))
                val_loss += loss.item()
        
        train_loss /= len(train_loader)
        val_loss /= len(val_loader)
        
        print(f'Epoch {epoch+1}:')
        print(f'Training Loss: {train_loss:.4f}')
        print(f'Validation Loss: {val_loss:.4f}')
        
        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            save_checkpoint(model, optimizer, epoch,
                          'checkpoints/best_model.pth')
        
        # Save checkpoint every 5 epochs
        if (epoch + 1) % 5 == 0:
            save_checkpoint(model, optimizer, epoch,
                          f'checkpoints/checkpoint_epoch_{epoch+1}.pth')

if __name__ == "__main__":
    train_model()
