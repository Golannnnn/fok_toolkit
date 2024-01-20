# FOK!Forum Toolkit

Dit is een browser extensie voor het FOK!forum. Het is een verzameling van scripts die het forum een stukje gebruiksvriendelijker maken. De extensie is beschikbaar voor Chrome en Firefox desktop (hopelijk binnenkort ook voor mobiel).

- Alleen actief wanneer je op het forum en in een topic bent (forum.fok.nl/topic/).
- Alleen de volgende data wordt opgeslagen in de lokale opslag van je browser: gebruikersnamen van users die je blockt en een api key voor de plaatjes upload service. Niets wordt naar een server gestuurd en je kan je lokale opslag altijd legen.

De extensie folders kan je hier downloaden: https://github.com/Golannnnn/fok_toolkit/releases/

## Features

- [x] [Gebruikers blokkeren](#blocker)
- [x] [Plaatjes uploaden met één klik](#uploader)
- [x] [Scrollen naar boven en beneden met één klik](#scroller)
- [ ] Mentions geschiedenis (coming soon)

## Verzoeken en bugs

Heb je een verzoek voor een nieuwe feature? Of een bug? Laat het weten in [coming soon](https://forum.fok.nl/topic/).

## Meehelpen

De extensie is open source en iedereen kan meehelpen. Fork de repo, lees de [HOWTO](HOWTO.md) en maak een pull request. Kom je er niet uit? Stel je vraag in [coming soon](https://forum.fok.nl/topic/).

## Blocker

Voegt een knop toe aan elke post om de gebruiker te blokkeren of om een specifieke post te verbergen:

![blocker afbeelding 1](public/readme/blocker_2.png)

Voegt een knop toe aan de header van de pagina om geblokkeerde gebruikers te bekijken en deblokkeren:

![blocker afbeelding 2](public/readme/blocker_1.png)

## Uploader

Voegt een knop toe aan de editor om een plaatje te uploaden:

![uploader video](public/readme/uploader_480.gif)

Je moet eerst een [account aanmaken op imgbb](https://imgbb.com/signup), een [api key genereren](https://api.imgbb.com) en daarna de api key invoeren in de extensie:

![uploader afbeeling 1](public/readme/uploader_1.png)

## Scroller

Voegt twee knoppen toe aan rechtsonder in de pagina om naar boven en beneden te scrollen:

![scroller afbeeling 1](public/readme/scroller.png)

## How to manually load the extension in Firefox:

1. Open Firefox and type `about:addons` in the URL bar.
2. Click on the gear icon in the top right corner and select `Debug Add-ons`.
3. Click on `Load Temporary Add-on...` and select the `manifest.json` file from the extension folder.
4. Click on the `extensions` icon in the top right corner.
5. Click on the `gear` icon in the top right corner and select `Pin to Toolbar`.

## How to manually load the extension in Chrome:

1. Open Chrome and type `chrome://extensions` in the URL bar.
2. Enable `Developer mode` in the top right corner.
3. Click on `Load unpacked` and select the extension folder.
4. Click on the `extensions` icon in the top right corner and pin the extension to the toolbar.
