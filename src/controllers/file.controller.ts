import path from 'path';

class FileController {
  getCV = async (req, res, next) => {
    const pdfPath = '/home/ubuntu/pdf';
    const fileName = 'my-cv.pdf';
    const filePath = path.join(pdfPath, fileName);

    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(err.status).end();
      }
    });
  };
}

export default new FileController();
