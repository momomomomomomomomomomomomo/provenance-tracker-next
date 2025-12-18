'use client';

import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { FRONTEND_URL } from '@/lib/config';

export default function QRCodeGenerator ({id}:{id:string}) {

  const qrValue = `${FRONTEND_URL}/?productId=${id}`;

  const downloadQRCode = () => {
    const svg = document.getElementById('QRCode') as SVGSVGElement | null;
    if (!svg) {
      console.error('Could not find QR code element');
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get canvas context');
      return;
    }

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.download = 'qrcode.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
      {qrValue && (
        <>
          <QRCodeSVG
            id="QRCode"
            value={qrValue}
            size={256}
            level={"L"}
            includeMargin={true}
          />
          
          <Button variant={'default'} onClick={downloadQRCode}>
            Download QR Code
          </Button>
          
        </>
      )}
    </div>
  );
}