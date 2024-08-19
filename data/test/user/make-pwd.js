import { readJson, writeJson } from '../lib-json.js';

const PATH_HERE = import.meta.dirname;

let pwdList = await readJson(PATH_HERE, 'pwd-list-old.json').then(res => res.data);
let userList = await readJson(PATH_HERE, 'users.json');

const newList = [];

for (let i = 0; i < pwdList.length; i++) {
  if (pwdList[i].id !== userList[i].id) {
    throw new Error('Ahhh, ID mismatch');
  }

  newList.push({
    id: pwdList[i].id,
    name: userList[i].name,
    email: userList[i].email,
    password: pwdList[i].password
  });
}
// console.log(newList);

await writeJson(PATH_HERE, 'password-list.json', newList);
