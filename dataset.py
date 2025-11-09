import torch
from torch.utils.data import Dataset
from PIL import Image
import numpy as np
from pathlib import Path

class ForgeryDataset(Dataset):
    """
    Dataset class for Scientific Image Forgery Detection
    """
    def __init__(self, root_dir, mode='train', transform=None):
        """
        Args:
            root_dir (str): Path to the data directory
            mode (str): 'train' or 'test'
            transform: Optional transform to be applied on images
        """
        self.root_dir = Path(root_dir)
        self.mode = mode
        self.transform = transform
        self.image_paths = []
        
        if mode == 'train':
            # Add authentic images
            authentic_dir = self.root_dir / 'train_images' / 'authentic'
            self.image_paths.extend(list(authentic_dir.glob('*.png')))
            
            # Add forged images
            forged_dir = self.root_dir / 'train_images' / 'forged'
            self.image_paths.extend(list(forged_dir.glob('*.png')))
        else:
            # Test images
            test_dir = self.root_dir / 'test_images'
            self.image_paths.extend(list(test_dir.glob('*.png')))
    
    def __len__(self):
        return len(self.image_paths)
    
    def __getitem__(self, idx):
        img_path = self.image_paths[idx]
        image = Image.open(img_path).convert('RGB')
        
        if self.transform:
            image = self.transform(image)
        
        if self.mode == 'train':
            # Check if image is forged
            is_forged = 'forged' in str(img_path)
            
            if is_forged:
                # Load corresponding mask
                mask_path = self.root_dir / 'train_masks' / f"{img_path.stem}.npy"
                mask = np.load(mask_path)
                mask = torch.from_numpy(mask).float()
                return image, mask, is_forged
            
            return image, torch.zeros((image.shape[1], image.shape[2])), is_forged
        
        return image, img_path.stem  # For test set, return image and ID
