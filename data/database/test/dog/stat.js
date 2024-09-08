import {readJson} from '../lib-json.js';

const path_here = import.meta.dirname;

const dogList = await readJson(path_here, 'dogs-0902.json');

console.log(dogList[0]);

// 統計 breed 的筆數

const breedCount = new Map();

dogList.forEach(dog => {
  const breed = dog.breed;
  breedCount.set(breed, (breedCount.get(breed) || 0) + 1);
});

console.log(breedCount);