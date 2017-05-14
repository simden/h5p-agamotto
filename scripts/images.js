(function (Agamotto) {
  'use strict';

  /**
   * Images object
   *
   * @class H5P.Agamotto.Images
   * @param {Object} images - Array containing the images.
   */
   Agamotto.Images = function (images) {
     this.images = images;

     this.ratio = this.images[0].naturalWidth / this.images[0].naturalHeight;

     /*
      * Users might use images with different aspect ratios -- I learned that the hard way ;-)
      * Use the dimensions of the first image, resize the others and add a black border if necessary.
      * We need the black border in the image because of the blending transition. We also need
      * it for images with transparency.
      */
     var firstMaxX = this.images[0].naturalWidth;
     var firstMaxY = this.images[0].naturalHeight;
     for (var i = 0; i < this.images.length; i++) {
       var maxX = firstMaxX;
       var maxY = firstMaxY;
       var imgX = images[i].naturalWidth;
       var imgY = images[i].naturalHeight;

       // Scale image.
       if ((imgX / imgY < this.ratio) && (imgY > maxY)) {
         imgY = maxY;
         imgX *= maxY / this.images[i].naturalHeight;
       }
       if ((imgX / imgY > this.ratio) && (imgX > maxX)) {
         imgX = maxX;
         imgY *= maxX / this.images[i].naturalWidth;
       }
       if ((imgX / imgY === this.ratio)) {
         maxX = Math.max(maxX, imgX);
         maxY = Math.max(maxY, imgY);
       }

       // Compute offset for centering.
       var offsetX = Agamotto.constrain((maxX - imgX) / 2, 0, maxX);
       var offsetY = Agamotto.constrain((maxY - imgY) / 2, 0, maxY);

       // Create scaled image with black border.
       var imageCanvas = document.createElement('canvas');
       imageCanvas.setAttribute('width', maxX);
       imageCanvas.setAttribute('height', maxY);
       var imageCtx = imageCanvas.getContext('2d');
       imageCtx.beginPath();
       imageCtx.rect(0, 0, maxX, maxY);
       imageCtx.fillStyle = 'black';
       imageCtx.fill();
       imageCtx.drawImage(this.images[i], offsetX, offsetY, imgX, imgY);

       // Replace the old image.
       var image = new Image();
       image.src = imageCanvas.toDataURL('image/jpeg');
       this.images[i] = image;
     }

     this.imageTop = document.createElement('img');
     this.imageTop.classList.add('h5p-agamotto-image-top');
     this.imageTop.src = images[0].src;
     this.imageTop.setAttribute('draggable', 'false');
     this.imageTop.setAttribute('tabindex', 0);

     this.imageBottom = document.createElement('img');
     this.imageBottom.classList.add('h5p-agamotto-image-bottom');
     this.imageBottom.src = images[1].src;
     this.imageBottom.setAttribute('draggable', 'false');

     this.container = document.createElement('div');
     this.container.classList.add('h5p-agamotto-images-container');
     this.container.appendChild(this.imageTop);
     this.container.appendChild(this.imageBottom);
   };

   Agamotto.Images.prototype = {
     getDOM: function getDOM () {
       return this.container;
     },
     setImage: function setImage (index, opacity) {
       this.imageTop.src = this.images[index].src;
       this.imageBottom.src = this.images[Agamotto.constrain(index + 1, 0, this.images.length - 1)].src;
       this.imageTop.style.opacity = opacity;
     },
     resize: function resize () {
       this.container.style.height = this.container.offsetWidth / this.ratio + 'px';
     },
     getRatio: function getRatio() {
       return this.ratio;
     }
   };

})(H5P.Agamotto);
