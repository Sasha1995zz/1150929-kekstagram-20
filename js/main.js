'use strict';

(function () {

  var PHOTO_NUMBER = 25;
  var ALLOWED_COMMENTS_NUMBER = 30;
  var PICTURE_TEMPLATE = document.getElementById('picture').content.querySelector('.picture');
  var PICTURES_CONTAINER = document.querySelector('.pictures');
  var ESCAPE_BTN =  'Escape';
  var pictures =  document.querySelector('.pictures');

  var MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var NAMES = [
    'Петя',
    'Вася',
    'Катя',
    'Даша'
  ];

  // Максимум не включается, минимум включается
  function getRandomInteger(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandomArrayElement(array) {
    return array[getRandomInteger(0, array.length)];
  }

  function getPhotoObject(photoNumber, description, likes, comments) {
    return {
      url: 'photos/' + photoNumber + '.jpg',
      description: description,
      likes: likes,
      comments: comments
    };
  }

  function getCommentObject(avatarNumber, message, name) {
    return {
      avatar: 'img/avatar-' + avatarNumber + '.svg',
      message: message,
      name: name
    };
  }

  function generateCommentsArray(commentsNumber) {
    var comments = [];
    for (var i = 0; i < commentsNumber; i++) {
      var comment = getCommentObject(
          getRandomInteger(1, 7),
          getRandomArrayElement(MESSAGES),
          getRandomArrayElement(NAMES)
      );
      comments.push(comment);
    }
    return comments;
  }

  function generatePhotosArray(photosNumber) {
    var photos = [];
    for (var i = 0; i < photosNumber; i++) {
      var photo = getPhotoObject(
          getRandomInteger(1, 26),
          'Описание фотографии по умолчанию',
          getRandomInteger(15, 201),
          generateCommentsArray(getRandomInteger(0, ALLOWED_COMMENTS_NUMBER))
      );
      photos.push(photo);
    }
    return photos;
  }

  var photos = generatePhotosArray(PHOTO_NUMBER);

  function getPictureTemplate(picture) {
    var pictureElement = PICTURE_TEMPLATE.cloneNode(true);
    var imgElement = pictureElement.querySelector('img');
    imgElement.src = picture.url;
    var pictureLikesElement = pictureElement.querySelector('.picture__likes');
    pictureLikesElement.innerText = picture.likes;
    var pictureCommentsElements = pictureElement.querySelector('.picture__comments');
    pictureCommentsElements.innerText = picture.comments.length;
    return pictureElement;
  }

  var fragment = document.createDocumentFragment();
  for (var i = 0; i < photos.length; i++) {
    fragment.appendChild(getPictureTemplate(photos[i]));
  }
  PICTURES_CONTAINER.appendChild(fragment);

  var bigPhoto = document.querySelector('.big-picture');

  var renderComment = function (commentElement) {
    var commentNode = document.querySelector('.social__comment').cloneNode(true);
    commentNode.querySelector('.social__picture').setAttribute('src', commentElement.avatar);
    commentNode.querySelector('.social__picture').setAttribute('alt', commentElement.name);
    commentNode.querySelector('.social__text').innerText = commentElement.message;
    return commentNode;
  };

  var generateCommentsFragment = function (arr) {
    var fragmentComments = document.createDocumentFragment();
    var allCommentsNode = document.querySelector('.social__comments').cloneNode();
    for (var i = 0; i < arr.length; i++) {
      allCommentsNode.appendChild(renderComment(arr[i]));
    }
    fragmentComments.appendChild(allCommentsNode);
    return fragmentComments;
  };

  var showPhoto = function (photoElement) {
    bigPhoto.querySelector('.big-picture__img').firstElementChild.setAttribute('src', photoElement.url);
    bigPhoto.querySelector('.likes-count').innerText = photoElement.likes;
    bigPhoto.querySelector('.comments-count').innerText = photoElement.comments.length;
    bigPhoto.querySelector('.social__caption').innerText = photoElement.description;
    bigPhoto.querySelector('.social__comment-count').classList.add('hidden');
    bigPhoto.querySelector('.comments-loader').classList.add('hidden');
    bigPhoto.querySelector('.social__comments').parentNode.replaceChild(generateCommentsFragment(photoElement.comments), bigPhoto.querySelector('.social__comments'));
    bigPhoto.classList.remove('hidden');
    document.body.classList.add('modal-open');
    return bigPhoto;
  };
  //showPhoto(photos[0]);

  //Загрузка изображения и показ формы и ее закрытие
  var ESC_KEY = 'Escape';
  var uploadFile = document.getElementById('upload-file');
  var uploadImgEditor = document.querySelector('.img-upload__overlay');
  var closeImgEditorBtn = uploadImgEditor.querySelector('.img-upload__cancel');
  var effectLevelPin = uploadImgEditor.querySelector('.effect-level__pin');
  var effectsList = uploadImgEditor.querySelector('.effects__list');
  var hashtags = uploadImgEditor.querySelector('.text__hashtags');
  var imgUploadBtn = uploadImgEditor.querySelector('.img-upload__submit');

  var onPopupEscPress = function (evt) {
    if (evt.key === ESC_KEY) {
      closePopup();
    }
  };

  var openPopup = function () {
    uploadImgEditor.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  var closePopup = function () {
    uploadImgEditor.classList.add('hidden');
    document.body.classList.remove('modal-open');
    uploadImgEditor.value = '';
  };

  uploadFile.addEventListener('change', function () {
    openPopup();
    document.addEventListener('keydown', onPopupEscPress);
  });

  closeImgEditorBtn.addEventListener('click', closePopup);

  //ползунок слайдера
  //effectLevelPin.addEventListener('mouseup', function (evt) {

  //};

  //Валидация хеш-тегов
  var controlHashtag = function (value) {
  if (value === '' || value === null) {
    return false;
  }
  var fieldHashtag  = value.split(' ');
  if (fieldHashtag.length > 5) {
    return 'Допускается не более 5 хештегов';
  }

  for (var i = 0; i < fieldHashtag.length; i++) {
    var checkValue = fieldHashtag[i].match(/^#[\wа-яА-я]+/) || [];
    var counter = 0;
    if (fieldHashtag[i] !== checkValue[0]) {
      return 'Хештег номер ' + (i + 1) + ' имеет неверный формат';
    }
    for (var j = 0; j < fieldHashtag.length; j++) {
      if (fieldHashtag[i].toLowerCase() === fieldHashtag[j].toLowerCase()) {
        counter++;
      }
    }
    if (counter > 1) {
      return 'Имеются одинаковые хештеги';
    }
  }
  return false;
};


imgUploadBtn.addEventListener('click', function () {
  if (controlHashtag(hashtags.value)) {
    hashtags.setCustomValidity(controlHashtag(hashtags.value));
  } else {
    hashtags.setCustomValidity('');
  }
});

})();
