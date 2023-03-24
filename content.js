start();

function start(){
    // wait till async loading finished
    waitForElm('div[data-v-98bc806a] div.animate-pulse[style="display: none;"]').then((elm) => {
        addCover();
        // re-start script when buttons for async pagnation or reload are clicked
        $("a[data-v-f4de5fb0]").off('click').click(()=>{
            start();
        });
    });
}

function waitForElm(selector) {
    return new Promise(resolve => {
        if ($(selector).length) {
            return resolve(true);
        }

        const observer = new MutationObserver(mutations => {
            if ($(selector).length) {
                resolve(true);
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function addCover() {
    $('li[data-v-98bc806a] a.series-link').each(async function(index, value) {
        let imageUrl;
        let url = value.href;
        let hostname = new URL(url).hostname;
        let selector = getSelector(hostname);
        let response;
        // check if link is in list of kwons sites
        if(selector){
            try {
            // async call of linked site
            // const response = await $.get(url);
            response = await $.get(url);
            //   use jquery to get image using the specific selector
            imageUrl = $(response).find(selector).attr('src');
            } catch (error) {
                console.error(url+" - ",error);
            }
        }

        // check if picture was found
        if (imageUrl) {
        //   add image to current site
            $(this).parents("li[data-v-98bc806a]").prepend($('<img class="cover" src="'+imageUrl+'">'));
        } else {
            if(!isKnownError(hostname)){
                console.log(url);
            }
            // else use default image
            $(this).parents("li[data-v-98bc806a]").prepend($('<img class="cover" src="'+browser.runtime.getURL("kenmei.png")+'">'));
        }
    });
}

function isKnownError(hostname){
    switch (hostname) {
        case "realmscans.com":
            return true;
        case "mangadex.org":
            return true;
        case "en.leviatanscans.com":
            return true;
        case "zeroscans.com":
            return true;
        case "reaperscans.com":
            return true;
        case "reset-scans.com":
            return true;
        case "lhtranslation.net":
            return true;
        case "gdscans.com":
            return true;
        case "mangasushi.org":
            return true;
        case "tritinia.org":
            return true;
        default:
            return false;
    }
}

// specific selectors to get image from different sites
function getSelector(hostname) {
    let selector;
    switch (hostname) {
        case "mangahub.io":
            selector = 'img.manga-thumb';
            break;
        case "www.asurascans.com":
            selector = "div.thumb img";
            break;
        case "flamescans.org":
            selector = "div.thumb img";
            break;
        case "luminousscans.com":
            selector = "div.thumb img";
            break;
        case "tapas.io":
            selector = "a.thumb img";
            break;
// lazy loading? - white
    // case "mangasushi.org":
    //     selector = "div.summary_image > a > img";
    //     break;
    // case "lhtranslation.net":
    //     selector = "div.summary_image > a > img";
    //     break;
    // case "gdscans.com":
    //     selector = "div.summary_image img.img-responsive";
    //     break;
    // case "tritinia.org":
    //     selector = "div.summary_image img.img-responsive";
    //     break;

// 403 forbidden
    // case "reset-scans.com":
        // selector = "div.summary_image > a > img";
        // break;
    // case "reaperscans.com":
    //     selector = "div.mx-auto.container img";
    //     break;
    // case "en.leviatanscans.com":
    //     selector = "div.summary_image img.img-responsive";
    //     break;
    
// fails on robot-check
    // case "realmscans.com":
    //     selector = "div.thumb img";
    //     break;
        
// needs JS to load site
    // case "mangadex.org":
    // selector = 'img[data-v-c3aeb45c]';
    // selector = 'img[alt="Cover image"]';
    // break;

// image as div background
    // case "zeroscans.com":
    //     selector = "div.image--cover";
    //     break;

    }
    return selector;
}
