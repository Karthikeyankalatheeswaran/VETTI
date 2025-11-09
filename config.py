"""
Configuration settings for the Scientific Image Forgery Detection project
"""

class Config:
    # Data paths
    DATA_ROOT = 'data'
    TRAIN_AUTHENTIC_DIR = f'{DATA_ROOT}/train_images/authentic'
    TRAIN_FORGED_DIR = f'{DATA_ROOT}/train_images/forged'
    TRAIN_MASKS_DIR = f'{DATA_ROOT}/train_masks'
    TEST_IMAGES_DIR = f'{DATA_ROOT}/test_images'
    
    # Training parameters
    BATCH_SIZE = 8
    LEARNING_RATE = 1e-4
    NUM_EPOCHS = 50
    DEVICE = 'cuda'  # or 'cpu' if GPU not available
    
    # Model parameters
    INPUT_CHANNELS = 3
    OUTPUT_CHANNELS = 1
    
    # Image parameters
    IMAGE_SIZE = 512  # Resize images to this size
    
    # Augmentation parameters
    RANDOM_SEED = 42
    VAL_SPLIT = 0.2  # 20% validation split
