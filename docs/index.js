"use strict";


const clearSayIt = document.getElementById("clear-console");
const sayIt = document.getElementById("say_it");
const sayAlert = (msg) => {
    sayIt.innerHTML = msg + "<br>" + sayIt.innerHTML
}; //sayAlert


class ThemeManager {

    toggleCtrl;
    logIt;
    docRoot;
    current = "light";
    themes = {};
    names = ["light", "dark"];
    index = 0;
    constructor(log = console.log , toggleCtrlOrID = `theme-toggler` ){
 this.logIt = log;


if (typeof toggleCtrlOrID === "string") this.toggleCtrl = document.getElementById(toggleCtrlOrID)
else this.toggleCtrl = toggleCtrlOrID;
this.docRoot = document.querySelector(":root");
this.initThemes();
this.toggleCtrl.onclick = () => { this.nextTheme();};

    }; //constructor
    initThemes()   {
        class themeColors {
            name = "";
            bg = "#000080";
            color = "yellow";
            constructor( themName, themeBg, themeColor){
        if (themName) this.name = themName;
        if (themeBg) this.bg = themeBg; 
        if (themeColor) this.color = themeColor;
            }; //constructor
        }; // class themeColors
        try{ 
        const rs = getComputedStyle(this.docRoot);
    
        const getColor = (name, suffix) => {
    const cName = `--${name}-${suffix}`
    return rs.getPropertyValue(cName);
        }; //getColor
    const curBG = getColor("theme", "bg");
    this.names.forEach((n) => {
        const bg = getColor(n, "bg");
        if (bg === curBG) this.current= n;
        const color = getColor(n, "color");
        this.themes[n] = new themeColors(n, bg, color);
    
    }); // forEach
    this.index = this.names.findIndex( (t) => {return (t ===  this.current);});
this.    setThemeButtonCaption();
    
        } catch(error) {
            this.logIt( `InitThemes error: ${error.message} `); 
        }; //catch
    }; // initThemes

nextIndex() {
let i = this.index  + 1;
if (i >= this.names.length) i = 0;
return i;
}; // nextIndex
nextTheme() {
const i = this.nextIndex(), r = this.docRoot;
const name = this.names[i];
this.logIt(`Switching to ${name}`);
const theme = this.themes[name];
const setColor = (suffix, color) => {
    const tColor  = `--theme-${suffix}`;
  r.style.setProperty(tColor, color);
}; // setColor
setColor("bg", theme.bg);
setColor("color", theme.color);
this.index = i; this.current = name;
this.setThemeButtonCaption();


}; // nextTheme
    setThemeButtonCaption()  {
        const nextTheme = this.names[ this.nextIndex()];
        const caption = `Switch to ${nextTheme} theme`
        this.toggleCtrl.innerText= caption;
       this.toggleCtrl .setAttribute("alt", caption )
        ;    }; // setThemeButtonCaption
}; // ThemeManager


let themeMgr;
{
    sayIt.innerHTML = "";
    
    themeMgr = new ThemeManager( sayAlert); 

const props  = `Ready..`;
 
sayAlert(props);
clearSayIt .onclick = () => { sayIt.innerHTML = "";};


}




// <script>lue
// function myFunction_get() {
//   // Get the styles (properties and values) for the root
// }

// // Create a function for setting a variable value
// function myFunction_set() {
//   // Set the value of variable --blue to another value (in this case "lightblue")
//   r.style.setProperty('--blue', 'lightblue');
// }
// </script>
