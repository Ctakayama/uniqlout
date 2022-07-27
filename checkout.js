const puppeteer = require('puppeteer-extra');
const pluginStealth = require("puppeteer-extra-plugin-stealth");
const fs = require('fs');
puppeteer.use(pluginStealth())

const sizes  = new Map();

sizes.set('XXS', 'SMA001');
sizes.set('XS', 'SMA002');
sizes.set('S', 'SMA003');
sizes.set('M', 'SMA004');
sizes.set('L', 'SMA005');
sizes.set('XL', 'SMA006');

async function openBrowser(){


    const browser = await puppeteer.launch({headless: false});

    const page = await browser.newPage();
    await page.setViewport({
        width: 1200,
        height: 800
    });

    return page;
}

async function goTo(page, myUrl){
    console.log('loading page: '+ myUrl);
    await page.goto('https://www.uniqlo.com/us/en/' + myUrl + '.html');
    try{
        await page.$eval("button[id='closeIconContainer']", elem =>elem.click());

    }
    catch(e){
        console.log('no popup to remove');
    }
}

async function pickSize(page, mySize){
    console.log("Selecting size: " + mySize);
    try{
        await page.$eval("input[id='"+ mySize + "']", elem =>elem.click());
    }
    catch(e){
        console.log('cannot find mySize: ' + mySize);

    }
}
async function addToCart(page){
    console.log("attempting to add to cart")
    
    await page.$eval("button[title='Add to Cart']", elem =>elem.click());

}

async function pickClothes(myPage, myUrl, mySize){
    console.log('starting shopping');
    await goTo(myPage, myUrl);
    await pickSize(myPage, mySize);
    myPage.waitForTimeout(2000);
    await addToCart(myPage);
    
}

async function runBot(){
    const page = await openBrowser();

    // const shoppingList = [['451868', 'L'], ['451868', 'S']];
    const shoppingList = [['451380', 'XS']];
    for(let i  = 0; i < shoppingList.length; i++){
        await pickClothes(page, shoppingList[i][0], shoppingList[i][1]);
    }




}

runBot();