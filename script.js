const input = document.getElementById("search");
const characterList = document.getElementById("characters-list");
const charactersDetails = document.getElementById("characters-details");
const favouriteList = document.getElementById("favourite-list");
const button = document.getElementById("favourites");

//load the favourite list from the data stored in browser
if (localStorage.getItem("favourites")) {
  var listContents = JSON.parse(localStorage.getItem("favourites"));
  listContents.forEach((i) => {
    var list1 = document.createElement("li");
    list1.innerHTML = i;
    favouriteList.append(list1);
  });
} else {
  var listContents = [];
}

//This function returns promise and the JSON response from the URL.
async function getCharacters() {
  var response = await fetch(
    "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=01c5361bd04abcc02ab06305ec9a9135&hash=20cbc53cc6657ef6345fa4156bf3f822"
  );
  var parsedResponse = await response.json();
  return parsedResponse;
}

//This funtion is called on windows onload and fetches the data from getCharacters()
function addCharacters() {

  getCharacters().then((res) => {
    var Array = res.data.results;
    Array.forEach((element) => {
      //Creates each li and appends it to the ul.
      var listItem = document.createElement("li");
      var imageUrl = element.thumbnail.path.toString() + ".jpg";
      listItem.innerHTML = `<div class="card" style="width: 18rem; margin:15px;">
      <a onclick="addCharacterDetails(this)" id="${element.id}">
      <img src="${imageUrl}" class="card-img-top" alt="character-image">
      </a>
      <div class="card-body">
        <h5 class="card-title">${element.name}</h5>
        <button id="fav">Add to Fav</button>
      </div>
    </div>`;
      characterList.append(listItem);
      var button1 = listItem.querySelector("#fav");
      //click on each favourite button is handled.
      button1.addEventListener("click", (e) => {
        var listItem1 = document.createElement("li");
        listItem1.innerHTML = `<div class="card" style="width: 18rem; margin:15px;">
              <a onclick="addCharacterDetails(this)" id="${element.id}">
              <img src="${imageUrl}" class="card-img-top" alt="character-image">
              </a>
              <div class="card-body">
                <h5 class="card-title">${element.name}</h5>
                <button id="remove">Remove from fav</button>
              </div>
              <div>`;
        listContents.push(listItem1.innerHTML);
        localStorage.setItem("favourites", JSON.stringify(listContents));
        favouriteList.append(listItem1);
        
        e.target.setAttribute("disabled",true);
      });
    });
  });
}

// call specific character details  
function addCharacterDetails(ele){

  console.log(ele);
  const id = ele.getAttribute('id');
  
  async function getCharactersDetails() {
    let response = await fetch(
      `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=01c5361bd04abcc02ab06305ec9a9135&hash=20cbc53cc6657ef6345fa4156bf3f822`
    );
    let parsedResponse = await response.json();
    return parsedResponse;
  }
  
  getCharactersDetails().then((res)=>{ 
    let array = res.data.results;
    array.forEach((element) => {
      console.log(element);
      let listItem = document.createElement("li");
      let imageUrl = element.thumbnail.path.toString() + ".jpg";
      let urlItemList = '';
      element.urls.forEach(ele => {
        let name=ele.type.charAt(0).toUpperCase() + ele.type.substring(1);
        let li = `<li><b><span>${name} - </span></b><a href="${ele.url}" class="url-list">${ele.url}</a></li>`;

        urlItemList = urlItemList + li;

      })

      console.log(urlItemList);

      listItem.innerHTML = `<div class="detail"> 
            <h4>${element.name}</h4> 
            <img src="${imageUrl}" class="center">
            <p>${element.description}</p>
            <p><ul>
              ${urlItemList}
            </ul></p>
            </div>`;

      charactersDetails.append(listItem);
    });
   })
   favouriteList.style.display = "none";
   charactersDetails.style.display = "block";
   characterList.style.display = "none";
}

//Favourites Tab function is handled here
button.addEventListener("click", () => {
  favouriteList.style.display = "flex";
  characterList.style.display = "none";
  charactersDetails.style.display = "none";

  //remove from browser history and favourite list on pressing remove button is handled here
  liList = favouriteList.querySelectorAll("li");
  liList.forEach((li) => {
    var button2 = li.querySelector("#remove");
    button2.addEventListener("click", (e) => {
      e.target.parentElement.parentElement.remove();
      let result = listContents.indexOf(
        e.target.parentElement.parentElement.parentElement.innerHTML
      );
      listContents.splice(result, 1);
      localStorage.setItem("favourites", JSON.stringify(listContents));
    });
  });
});

//filtering the data based on search query
function filter() {
  // Declare variables
  var filter, ul, li, span, i, txtValue;
  filter = input.value.toUpperCase();
  console.log(filter);
  li = characterList.querySelectorAll("li");

  // Loop through all list items, and hide those who don't match the search query
  for (i = 0; i < li.length; i++) {
    span = li[i].getElementsByTagName("h5")[0];
    txtValue = span.textContent || span.innerText;
    console.log(txtValue);
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
