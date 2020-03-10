var slider = document.getElementById("myRange");
var output = document.getElementById("value");

output.innerHTML = slider.value;

slider.oninput = function(){
    output.innerHTML = this.value;
}

function update(num){

    var x = String( Number(slider.value) + num);
/*
    var color = 'linear-gradient(90deg, rgb(117,252,117)' + y + '%, rgb(214,214,214)' + y + '%)';
    slider.style.background = color;
  */
    slider.value = x;
    output.innerHTML = slider.value;
}

slider.addEventListener("mousemove", function(){
    var x = slider.value;
    var y = String( Number(slider.value) - 2009 + 10 );
    /*var color = 'linear-gradient(90deg, rgb(117,252,117)' + y + '%, rgb(214,214,214)' + y + '%)';
    slider.style.background = color;
     */

    var a = Number(slider.value) %2009 + 1 ;
    document.getElementById('image').src='/images/anim'+ a +'.png';
    document.getElementById('descriere').innerHTML = 'Poti face orice daca depui putin efort in plus pentru a reusi.';
    reloadCss();
});

window.addEventListener("keydown", checkKeyPress, false);

function checkKeyPress(key) {
    if (key.keyCode == "13" || key.keyCode == "39" || key.keyCode == "65" || key.keyCode == "66" || key.keyCode == "67" ) {
        var num = 1;
        update(num);
        var a = Number(slider.value) %2009 + 1 ;
        document.getElementById('image').src='/images/anim'+ a +'.png';
        document.getElementById('descriere').innerHTML = 'Trainingurile sunt una dintre oportunitatile de a te dezvolta alaturi de ceilalti.';
    }
    if(key.keyCode == "37"){
        var num = -1;
        update(num);
        var a = Number(slider.value) %2009 + 1 ;
        document.getElementById('image').src='/images/anim'+ a +'.png';
        document.getElementById('descriere').innerHTML = 'Trainingurile sunt una dintre oportunitatile de a te dezvolta alaturi de ceilalti.';
    }
    reloadCss();

}