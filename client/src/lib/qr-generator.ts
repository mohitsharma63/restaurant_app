export function generateQrCodeUrl(data: string): string {
  // Using a free QR code API service
  const encodedData = encodeURIComponent(data);
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
}

export function downloadQrCode(url: string, filename: string = 'qr-code.png') {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
