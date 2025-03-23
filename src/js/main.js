/**
 * @function myFunction - Funktion för att öppna och stänga hamburgermeny genom klick på symboler
 * @param menuSmall - Elementet för hamburgermenyn 
 * @param openBtn - Symbol för att visa en öppna knapp för menyn
 * @param closeBtn - Symbol för att visa en stäng knapp för menyn
 * openBtn och closeBtn ändrar display från flex till none och tvärtom beroende på initialvärdet vid klick
 */

"use strict";

    //läser in öppna och stäng knappar för meny
    let openBtn = document.getElementById("open-menu");
    let closeBtn = document.getElementById("close-menu");
    let searchBar = document.getElementById("search2")
    //när man klickar på menyikonerna körs myfunction
    openBtn.addEventListener('click', myFunction);
    closeBtn.addEventListener('click', myFunction);
    
    function myFunction() {
    
    //om menyn är stängd när man klickar fälls den ut och ändrar menyikon eller tvärtom
        var menuSmall = document.getElementById("menu-small");
        if (menuSmall.style.display === "block") {
          menuSmall.style.display = "none";
          openBtn.style.display = "flex";
          closeBtn.style.display = "none";
        } else {
          menuSmall.style.display = "block";
          openBtn.style.display = "none";
            closeBtn.style.display = "flex";
        }
      }