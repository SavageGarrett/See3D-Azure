function dropDown(index) {
  let collapseTd = document.getElementsByClassName("collapse-list");
  let mailingInfo = document.getElementsByClassName("long-mailing-info");

  if (collapseTd[index].children[1].innerHTML === "+") {
    mailingInfo[index].style.display = "block";
    collapseTd[index].children[1].innerHTML = "-";
  } else {
    mailingInfo[index].style.display = "none";
    collapseTd[index].children[1].innerHTML = "+";
  }
}
