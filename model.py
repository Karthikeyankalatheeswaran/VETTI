import torch
import torch.nn as nn

class UNet(nn.Module):
    """
    U-Net architecture for image segmentation
    """
    def __init__(self, in_channels=3, out_channels=1):
        super(UNet, self).__init__()
        
        # Encoder
        self.enc1 = self._make_layer(in_channels, 64)
        self.enc2 = self._make_layer(64, 128)
        self.enc3 = self._make_layer(128, 256)
        self.enc4 = self._make_layer(256, 512)
        
        # Bridge
        self.bridge = self._make_layer(512, 1024)
        
        # Decoder
        self.dec4 = self._make_layer(1024, 512)
        self.dec3 = self._make_layer(512, 256)
        self.dec2 = self._make_layer(256, 128)
        self.dec1 = self._make_layer(128, 64)
        
        # Final layer
        self.final = nn.Conv2d(64, out_channels, kernel_size=1)
        self.sigmoid = nn.Sigmoid()
        
        # Max pooling
        self.pool = nn.MaxPool2d(2)
        
        # Upsampling
        self.up = nn.Upsample(scale_factor=2, mode='bilinear', align_corners=True)
        
    def _make_layer(self, in_channels, out_channels):
        return nn.Sequential(
            nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True),
            nn.Conv2d(out_channels, out_channels, kernel_size=3, padding=1),
            nn.BatchNorm2d(out_channels),
            nn.ReLU(inplace=True)
        )
        
    def forward(self, x):
        # Encoder
        enc1 = self.enc1(x)
        enc2 = self.enc2(self.pool(enc1))
        enc3 = self.enc3(self.pool(enc2))
        enc4 = self.enc4(self.pool(enc3))
        
        # Bridge
        bridge = self.bridge(self.pool(enc4))
        
        # Decoder with skip connections
        dec4 = self.dec4(torch.cat([self.up(bridge), enc4], dim=1))
        dec3 = self.dec3(torch.cat([self.up(dec4), enc3], dim=1))
        dec2 = self.dec2(torch.cat([self.up(dec3), enc2], dim=1))
        dec1 = self.dec1(torch.cat([self.up(dec2), enc1], dim=1))
        
        # Final layer
        out = self.sigmoid(self.final(dec1))
        return out
