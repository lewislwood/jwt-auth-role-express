"use strict";




class TalkingConsole{
    container;
    talkCtrl;
    clearButton;
    hideClass = "hidden";
    keyEnums= {altKey: 2, ctrlKey:4, metaKey: 8, shiftKey: 16 }
    keyToggler= { key: "s",  altKey:true, ctrlKey: false, shiftKey: false, metaKey: false};
    keyClear= {key: "c",  altKey:true, ctrlKey: false, shiftKey: false, metaKey: false};
    keyTesters= { toggler: 0, clear: 0};
    constructor(containerDivOrID ="talk-container", talkCtrlOrID = "talk-control", clearButtonOrID = "talk-clear", hideClassName = "hidden") {
if (typeof containerDivOrID  === "string") this.container = document.getElementById(containerDivOrID )
else this.container = containerDivOrID ;
if (typeof talkCtrlOrID  === "string") this.talkCtrl = document.getElementById(talkCtrlOrID )
else this.talkCtrl = talkCtrlOrID ;
if (typeof clearButtonOrID  === "string") this.clearButton = document.getElementById(clearButtonOrID )
else this.clearButton = clearButtonOrID ;
this.hideClass = hideClassName 

this.clearButton.onclick = () => { this.talkCtrl.innerHTML = "";};

this.clear("");
this.enable(true, true);

    }; //constructor
    enable( forAll = false, displayInfoMsg = true) {
try {

const c = this.container;

c.setAttribute("aria-hidden", false);  // screen reader visible now
if (forAll) c.classList.remove(this.hideClass)  // Make visible for  All people
else c.classList.add(this.hideClass); // Hide from eyesight
if (displayInfoMsg ) this.sayIt(`Console enabled ${(forAll)? "for all": ""}`)

} catch(error) {
    this.sayIt(`enable error: ${error.message}  class = ${this.hideClass}`) 
}; // catch
    }; // enable( for All)
    disable( forAll = false, displayInfoMsg = true) {
        const c = this.container;
if (forAll) this.clear("");
        setTimeout(() => {        c.setAttribute("aria-hidden", forAll)}, 350);   // Hide or not to hide from screen reader
        c.classList.add(this.hideClass)  // Hide from eyesight 
if (displayInfoMsg ) this.sayIt(`Console disabled ${(forAll)? "for all": ""}`)
    }; // disable( forAll)
        sayIt( msg) {
            const tc = this.talkCtrl;
            tc.innerHTML = msg + "<br>"+ tc.innerHTML;
        }; // sayIt( msg)
        clear(infoMsg = "console cleared") {
this.talkCtrl.innerHTML = infoMsg ;
        }; // Clear()
        // Converts the event object into a bitwise number
            getKeyTest( ev) {
                const en = this.keyEnums;
let i = 0;
try{
if (ev.altKey) i = i + en["altKey"]; 

if (ev.ctrlKey ) i +=  en.ctrlKey;
if (ev.metaKey ) i +=  en.metaKey;
if (ev.shiftKey ) i +=  en.shiftKey;
return i;
} catch(error) {
this.sayIt(`TC.getTest error:  ${error.message}`);
}; // catch
            }; // getKeyTest
        setKeyTesters() {

const en = this.keyEnums;

const           kt = { clear: -1, toggler: -1};

if ( this.keyClear.key)kt.clear = this.getKeyTest(this.keyClear);
if ( this.keyToggler.key) kt.toggler= this.getKeyTest(this.keyToggler);
this.keyTesters = kt;
        }; // setKeyTesters
// KeyHandle will use bitwise logic 
keyHandler( ev) {
const eTest = this.getKeyTest(ev),  kt = this.keyTesters;
let handled = false;
try {

if ((eTest === kt.toggler&& (ev.key === this.keyToggler.key))) { 
    handled = true;
    this.toggleConsole();
} else if ((eTest === kt.clear) && (ev.key === this.keyClear.key)) {
    handled = true;
this.clear("Console cleared.");
}; 
if (handled) ev.preventDefault();

} catch(error) {
this.sayIt(`KH error: ${error.message}  kt is ${JSON.stringify(kt)}`);
};
}; // keyHandler;
toggleConsole() {
    const c = this.container;
   const isHidden =  c.classList.contains(this.hideClass);
   const isTalking = (c.getAttribute("aria-hidden") === "false");
   try {
   if (isTalking && isHidden) this.disable(true)  // Disable for all
else if (isTalking) this.enable(false)    //      
else this.enable( true);  // disable for all
   } catch(error) {
    this.sayIt(`tc error: ${error.message}`);

   }; //catch
}; // toggleConsole()
enableKeyHandling(toggleKey = {altKey: false, ctrlKey:true, shiftKey: true, metaKey: false, key: "D"}, clearKey = {altKey: false, ctrlKey:true, shiftKey: true, metaKey: false, key: "c"}) {
    try {
this.keyToggler = toggleKey ;
this.clearKey = clearKey;

this.setKeyTesters(); // Convert to a binary number for keyHandler
window.addEventListener( "keyup",(ev) => {this.keyHandler(ev);});
} catch(error) {
    this.logIt( `Talking Console Enable Key Handling error: ${error.message}`);

}; //catch
};  // enableKeyHandling




        
}; // talkingConsole



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


let themeMgr, sayAlert, talkCon ;
{
    
    talkCon = new TalkingConsole();     
    sayAlert =  (m) => {  talkCon .sayIt(m);};
    sayAlert("I installed talking console and now am running theme manager.")
    
    themeMgr = new ThemeManager( sayAlert); 
    sayAlert( "Now enabling key handling");
    talkCon.enableKeyHandling();


const props  = `Ready..`;
 
sayAlert(props);
clearSayIt .onclick = () => { sayIt.innerHTML = "";};


}
