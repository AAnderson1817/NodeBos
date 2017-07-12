import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e){
  e.preventDefault();
  console.log("Love It");
  axios
    .post(this.action)
    .then(res => {
      const isHearted = this.heart.classList.toggle('heart__button--hearted');
      $('.heart-count').textContent = res.data.hearts.length;
      //If a user favorites a store, we add a custom class --float which triggers a CSS animation of a floating heart. Since the heart could potentially interfere with navigation, we remove it from the DOM as soon as the animation finishes 2.5s later.
      if(isHearted){
        this.heart.classList.add('heart__button--float');
        setTimeout(() => this.heart.classList.remove('heart__button--float'), 2500);
      }


    })
    .catch(console.error);
}

export default ajaxHeart;
