import os
import kaggle
import shutil
from pathlib import Path

def download_competition_data():
    """
    Downloads the competition data using Kaggle API
    Note: Make sure you have your Kaggle API credentials in ~/.kaggle/kaggle.json
    """
    # Competition name
    competition = 'recodai-luc-scientific-image-forgery-detection'
    
    # Create data directory if it doesn't exist
    data_dir = Path('data')
    data_dir.mkdir(exist_ok=True)
    
    # Download the competition data
    try:
        kaggle.api.authenticate()
        kaggle.api.competition_download_files(competition, path='data')
        print("Successfully downloaded competition data")
        
        # Unzip the downloaded file
        for zip_file in data_dir.glob('*.zip'):
            shutil.unpack_archive(str(zip_file), str(data_dir))
            os.remove(zip_file)  # Remove zip file after extraction
            print(f"Extracted and removed {zip_file}")
    except Exception as e:
        print(f"Error downloading data: {e}")

if __name__ == "__main__":
    download_competition_data()
