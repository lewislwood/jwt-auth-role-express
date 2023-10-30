"use strict";




class TalkingConsole{
    container;
    talkCtrl;
    clearButton;
    hideClass = "hidden";
    keyEnums= {altKey: 2, ctrlKey:4, metaKey: 8, shiftKey: 16 }
    keyToggler= { name: "toggler", key: "D",  altKey:false, ctrlKey: true, shiftKey: true, metaKey: false, test: 0, action: null};
    keyClear= {name: "clear",key: "c",  altKey:true, ctrlKey: false, shiftKey: false, metaKey: false, test: 0, action: null};
    keyTesters= [];
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
this.disable(true, true);

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
        addKeyTest( kt) {
kt.test   = -1;
if ( kt.key) {
    kt.test  = this.getKeyTest(kt);
    kt.key  =   (kt.shiftKey)? kt.key.toUpperCase() : kt.key.toLowerCase();
};
const index = this.keyTesters.findIndex((k) => {return ( k.name===kt.name);});
if (index > -1) this.keyTesters[index] = kt
else  {
    this.keyTesters.push(kt); 
};
        }; // addKeyTest
keyHandler( ev) {
const eTest = this.getKeyTest(ev),  kt = this.keyTesters;
let handled = false;
try {

for (let iKey = 0; iKey < kt.length; iKey++) {
    const k = kt[iKey];

    if (k.test > -1) {
if ((k.test === eTest) && (k.key === ev.key)) {
handled = true;
this.sayIt(`Handling key ${k.name}`);
k.action(ev);
};
    }; // if kt > -1
}; // for

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
enableKeyHandling(toggleKey , clearKey ) {
    try {
        if (  toggleKey) this.keyToggler  = toggleKey
        else toggleKey = this.keyToggler;
        if ( clearKey) this.keyClear = clearKey
else clearKey= this.keyClear;
const validKey = (k) => {
    if (! ("name" in k)) k["name"] = null;
    if (! ("action" in k)) k["action"] = null;
};

validKey(toggleKey);validKey(clearKey);
if (! toggleKey.name) toggleKey.name = "toggler";
if (! toggleKey.action) toggleKey.action = () => { this.toggleConsole()}; 
if (! clearKey.name) clearKey.name = "clear";
if (! clearKey.action) clearKey.action = () => {this.clear("consel was cleared")}; 
this.addKeyTest(toggleKey);
this.addKeyTest(clearKey);
window.addEventListener( "keyup",(ev) => {this.keyHandler(ev);});
} catch(error) {
    this.sayIt( `Talking Console Enable Key Handling error: ${error.message}`);

}; //catch
};  // enableKeyHandling




        
}; // talkingConsole

class ThemeManager {

    toggleCtrl;
    logIt;
    docRoot;
    current = "light";
    themes = {};
    names = ["light", "dark"]; // Name of themes defied in css.
    SUFFIXES = ["CANVAS"]; // SUFFIXES BESIDES BG & COLOR
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
        const nTC =  new themeColors(n, bg, color);;
        this.themes[n] = nTC ;
        // add the additional suffixes colors
        this.SUFFIXES .forEach((s) => {
            nTC[s] = getColor(n, s);
            
        })
    
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
        this.toggleCtrl.innerText= `${nextTheme}`;
       this.toggleCtrl .setAttribute("alt", caption )
        ;    }; // setThemeButtonCaption
}; // ThemeManager


let themeMgr, sayAlert, talkCon , statusMessage;

// Displays a status message for a specified time in milliseconds, replaces current default or appends.
// Warning if to fast writing to status, prior clear timer will erase it too soon
const displayStatus = (msg) => {
 statusMessage.innerHTML = msg;
setTimeout( () => { statusMessage.innerHTML = "";}, 5000)

}; // displayStatus

const setCopyCode = () => {
    try {
    const copyCode = (e, c) => {
const code = c.innerHTML
navigator.clipboard.writeText(code);
displayStatus("Code copied to clipboard");
e.preventDefault();
  
    };  // copyCode 
    const makeCopyBtn = (code) => {
        const btn = document.createElement("button")
        btn.setAttribute("alt", "copy code to clpboard");
        btn.innerHTML = "copy";
        btn.setAttribute("class", "code-button")
        btn.onclick = (e) => { copyCode ( e, code);};
        return btn;
    }; //  makeCopyBtn 
const codes = document.querySelectorAll("code");
codes.forEach((code) => { 
    code.after(makeCopyBtn (code));}
    );
} catch(error) {
sayAlert(`setCopyCode error: ${error.message}` );
}; // catch
}; // setCopyCode



{
    statusMessage = document.getElementById(`status-message`);


    displayStatus("Loading...", 10000);



    
    
    talkCon = new TalkingConsole();     
    sayAlert = (msg) => {   talkCon.sayIt(msg);};
    talkCon.disable(true);

    setCopyCode ();


    sayAlert(" I am talking...");
    if (!statusMessage) sayAlert("something went wrong");


    sayAlert("Talking console loaded.");
    themeMgr = new ThemeManager( sayAlert); 
    talkCon.enableKeyHandling();
displayStatus("Loaded successfully..");

}
