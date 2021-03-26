/** 
 * Check platform and OS
	(platform.name); // 'Safari'
	(platform.version); // '11.1'
	(platform.product); // 'iPad'
	(platform.manufacturer); // 'Apple'
	(platform.layout); // 'WebKit'
	(platform.os.family); // 'iOS'
	(platform.description);// 'Safari 11.1 on Apple iPad (iOS 11.0)'
 
*/
function H5siOS() {
    var browserName=platform.os.family;  
    if(/ios/i.test(browserName) ){  
        return true;  
    } 
	return false;
}

function H5sChromeBrowser(){  
    var browserName=platform.name;  
    if(/chrome/i.test(browserName) ){  
        return true;  
    }  
    return false;
}  


function H5sEdgeBrowser(){  
    var browserName=platform.name;  
    if(/edge/i.test(browserName) ){  
        return true;  
    }  
    return false;
} 

function H5sSafariBrowser(){  
    var browserName=platform.name;  
	console.log(browserName);
    if(/safari/i.test(browserName) ){  
        return true;  
    }  
    return false;
}

function H5sAndriodPlatform(){  
    var browserName=platform.os.family;  
    if(/android/i.test(browserName) ){  
        return true;  
    }  
    return false;
}

/** 
 *=================H5Player Create
 *
 */
 
function H5sPlayerCreate(conf) {
	var player;

	if (H5siOS())
	{
        player = new H5sPlayerRTC(conf);
	}else{
        player = new H5sPlayerWS(conf);
	}
	return player;
}


function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}


function H5sSnapshot(vid, fileName)
{
	var video = vid;
	var w = video.videoWidth;//video.videoWidth * scaleFactor;
	var h = video.videoHeight;//video.videoHeight * scaleFactor;
	var canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	var ctx = canvas.getContext('2d');
	ctx.drawImage(video, 0, 0, w, h);
	var MIME_TYPE = "image/png";
	var imgURL = canvas.toDataURL(MIME_TYPE);

	var dlLink = document.createElement('a');
	dlLink.download = fileName;
	dlLink.href = imgURL;
	dlLink.dataset.downloadurl = [MIME_TYPE, dlLink.download, dlLink.href].join(':');

	document.body.appendChild(dlLink);
	dlLink.click();
	document.body.removeChild(dlLink);           
}
 

