import numpy as np
import torch
from pathlib import Path

def rle_encode(mask):
    """
    Convert a binary mask into RLE (Run-Length Encoding)
    Args:
        mask (numpy.ndarray): Binary mask of shape (H, W)
    Returns:
        str: RLE encoding as string
    """
    pixels = mask.flatten()
    pixels = np.concatenate([[0], pixels, [0]])
    runs = np.where(pixels[1:] != pixels[:-1])[0] + 1
    runs[1::2] -= runs[::2]
    return ' '.join(str(x) for x in runs)

def rle_decode(mask_rle, shape):
    """
    Decode RLE (Run-Length Encoding) to binary mask
    Args:
        mask_rle (str): RLE encoding string
        shape (tuple): Shape of the mask (H, W)
    Returns:
        numpy.ndarray: Binary mask of shape (H, W)
    """
    if mask_rle == 'authentic':
        return np.zeros(shape)
    
    s = mask_rle.split()
    starts, lengths = [np.asarray(x, dtype=int) for x in (s[0:][::2], s[1:][::2])]
    starts -= 1
    ends = starts + lengths
    img = np.zeros(shape[0] * shape[1], dtype=np.uint8)
    for lo, hi in zip(starts, ends):
        img[lo:hi] = 1
    return img.reshape(shape)

def ensure_dir(path):
    """
    Create directory if it doesn't exist
    Args:
        path (str or Path): Directory path
    """
    Path(path).mkdir(parents=True, exist_ok=True)

def save_checkpoint(model, optimizer, epoch, filename):
    """
    Save model checkpoint
    Args:
        model: PyTorch model
        optimizer: PyTorch optimizer
        epoch (int): Current epoch
        filename (str): Path to save checkpoint
    """
    checkpoint = {
        'epoch': epoch,
        'model_state_dict': model.state_dict(),
        'optimizer_state_dict': optimizer.state_dict(),
    }
    torch.save(checkpoint, filename)

def load_checkpoint(model, optimizer, filename):
    """
    Load model checkpoint
    Args:
        model: PyTorch model
        optimizer: PyTorch optimizer
        filename (str): Path to checkpoint file
    Returns:
        int: Last epoch number
    """
    checkpoint = torch.load(filename)
    model.load_state_dict(checkpoint['model_state_dict'])
    optimizer.load_state_dict(checkpoint['optimizer_state_dict'])
    return checkpoint['epoch']
