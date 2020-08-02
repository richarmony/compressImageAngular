import { Component, OnInit } from '@angular/core';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-image-compress',
  templateUrl: './image-compress.component.html',
  styleUrls: ['./image-compress.component.scss']
})
export class ImageCompressComponent implements OnInit {

  constructor(private imageCompress: NgxImageCompressService) { }
  file: File;
  predictions: number[];
  imageDataEvent: any;

  localUrl: any;
  localCompressedURl: any;

  isFlip = false;
  sizeOfOriginalImage: number;
  sizeOFCompressedImage: number;

  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;


  selectFile(event: any) {
    // console.log(event.target.files);
    let  fileName: any;
    this.file = event.target.files[0];
    fileName = this.file.name;
    console.log('file size:', this.file.size / (1024 * 1024));
    console.log('uploaded file:', this.file);

    if (event.target.files[0]) {
      // if (event.target.files && event.target.files[0]) {
      console.log('Will this execute?????');
      let newFile = this.resizeImg(this.file);

      console.log('DEBUG - newFile.size: ', newFile.size);
      console.log('DEBUG - newFile.name: ', newFile.name);


      // const reader = new FileReader();
      // reader.onload = (resp: any) => {
      // this.localUrl = resp.target.result;
      // this.compressFile(this.localUrl, fileName);
      // };
      // reader.readAsDataURL(event.target.files[0]);
    }

  }

  resizeImg(file: File) {
    console.log('TODO: - resize image ;)');
    // -- Read File:
    const reader = new FileReader();
    // let resizeFile: File;
    reader.onload = (resp: any) => {
      this.localUrl = resp.target.result;  // -- file raw data
      // resizeFile = this.compressFile(this.localUrl, file);
      this.compressFile(this.localUrl, file);

      // console.log('DEBUG - resizeFile.name: ', resizeFile.name);
      // console.log('DEBUG - resizeFile.size: ', resizeFile.size);
    };
    reader.readAsDataURL(file);



    // let upperLimit = 1024 * 1024; // -- 1MB
    let upperLimit = 1024 * 200; // -- 200 KB

    if(file.size > upperLimit) {
      console.log('Process image ;)');
      // -- process file :O
      return file;
    } else {
      console.log('Don\'t Process image ;)');
      return file;
    }
  }

  precompressFile(image, file: File) {
    const fileName = file.name;
    this.imageCompress.compressFile(image, orientation, 100, 50).then(
      result => {
        this.imgResultAfterCompress = result;
        this.localCompressedURl = result;
        this.sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
        // console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
        // create file from byte
        const imageName = fileName;
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(this.imgResultAfterCompress.split(',')[1]);
        const imageFile = new File([result], imageName, { type: 'image/jpeg' });
        // console.log('file size:', imageFile.size / (1024 * 1024));
        console.warn('preprocess file size:', imageFile.size / 1024);
        // console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
        // return imageFile;
      }
    );
  }

  compressFile(image, file: File) {
    const orientation = -1;
    const imageName = file.name;

    this.sizeOfOriginalImage = file.size / 1024;
    // this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / 1.333416054;
    // this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / 1.333416054;
    // this.sizeOfOriginalImage = this.imageCompress.byteCount(image) / (8);
    console.warn('Size in bytes is now:',  this.sizeOfOriginalImage);

    let currentSize = file.size;
    let desiredSize = 200 * 1024; // -- 200 KB
    // let desiredSize = 1 * 512 * 1024; // -- 500 KB

    let ratio = (desiredSize / currentSize) * 100;
    // let ratio = 100 * desiredSize / currentSize;
    // let ratio = (currentSize / desiredSize) * 100;
    // let ratio = 100 * currentSize / (desiredSize);

    if (currentSize < desiredSize) {
      ratio = 100;
    }
    console.log('currentSize:',  currentSize);
    console.log('desiredSize:',  desiredSize);
    console.log('Ratio:',  ratio);



    let newFile: File;
    this.imageCompress.compressFile(image, orientation, ratio, 50)
        .then( result => {
          this.imgResultAfterCompress = result;
          this.localCompressedURl = result;
          this.sizeOFCompressedImage = this.imageCompress.byteCount(result) / (1024 * 1024);
          // console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
          // create file from byte
          const imageFile = new File([result], imageName, { type: 'image/jpeg' });
          // console.log('file size:', imageFile.size / (1024 * 1024));
          console.warn('file size:', imageFile.size / 1024);
          newFile =  imageFile;
          console.log('DEBUG - newFile.name: ', newFile.name);
          console.log('DEBUG - newFile.size: ', newFile.size);
          return newFile;
          // console.warn('Size in bytes after compression:',  this.sizeOFCompressedImage);
        });
  }
   dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/jpeg' });
    return blob;
 }
  ngOnInit() {
  }

}
