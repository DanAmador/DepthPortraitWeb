export async function loadImagePaths() {
    const imagePaths = {
  "Portraits": {
    "Skull": {
      "rgb": "./../public/Portraits/Skull/skull.png",
      "depth": "./../public/Portraits/Skull/depth_skull.png"
    },
    "LineMan": {
      "depth": "./../public/Portraits/LineMan/depth_line.png",
      "rgb": "./../public/Portraits/LineMan/line.png"
    },
    "Road": {
      "depth": "./../public/Portraits/Road/depth_Road.png",
      "rgb": "./../public/Portraits/Road/Road.png"
    },
    "GrayMan": {
      "rgb": "./../public/Portraits/GrayMan/grey.png",
      "depth": "./../public/Portraits/GrayMan/depth_grey.png"
    },
    "Hands": {
      "rgb": "./../public/Portraits/Hands/hands.png",
      "depth": "./../public/Portraits/Hands/depth_hands.png"
    },
    "Obelisk": {
      "rgb": "./../public/Portraits/Obelisk/obelisk.png",
      "depth": "./../public/Portraits/Obelisk/depth_obelisk.png"
    },
    "DigitalSoul": {
      "rgb": "./../public/Portraits/DigitalSoul/DigitalSoul.png",
      "depth": "./../public/Portraits/DigitalSoul/depth_DigitalSoul.png"
    },
    "Robo World": {
      "rgb": "./../public/Portraits/Robo World/RoboWorld.png",
      "depth": "./../public/Portraits/Robo World/depth_RoboWorld.png"
    }
  }
};
    const loadedImages = {};

    for (const category in imagePaths) {
        loadedImages[category] = {};
        for (const item in imagePaths[category]) {
            loadedImages[category][item] = {};
            for (const imageType in imagePaths[category][item]) {
                loadedImages[category][item][imageType] = await import(imagePaths[category][item][imageType]);
            }
        }
    }

    return loadedImages;
}
