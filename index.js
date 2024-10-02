const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,  // Lancer sans interface graphique
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Définir la résolution de capture (par exemple 1920x1080)
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Charger la page web que tu veux streamer
  await page.goto('http://discode-studio.github.io/shortwave.bot/4625waterfall.html', { waitUntil: 'networkidle2' });
  
  // Capture vidéo de la page
  const ffmpeg = spawn('ffmpeg', [
   '-y',  // Pour écraser la sortie
        '-f', 'image2pipe',
        '-vcodec', 'mjpeg',
        '-i', 'pipe:0', // Entrée pipe
        '-vf', 'scale=1920:1080',  // Redimensionner la vidéo si nécessaire
        '-c:v', 'libx264',  // Codec vidéo
        '-preset', 'fast',  // Profil de vitesse de codage
        '-b:v', '3000k',  // Débit vidéo
        '-maxrate', '3000k',  // Débit max
        '-bufsize', '6000k',  // Taille du tampon
        '-pix_fmt', 'yuv420p',  // Format de pixels
        '-g', '50',  // Intervalle d'image clé
        '-f', 'flv', // Format de sortie
  `rtmp://a.rtmp.youtube.com/live2/sz87-dusv-psay-wsra-5xms`  // Utiliser la clé RTMP depuis les secrets GitHub
]);

  // Stream la capture de la page vers ffmpeg
  const streamVideo = async () => {
    const screenshot = await page.screenshot({ type: 'jpeg' });
    ffmpeg.stdin.write(screenshot);
    setTimeout(streamVideo, 33);  // Attendre environ 30 images par seconde
  };

  streamVideo();

  // Événements en cas d'erreur avec ffmpeg
  ffmpeg.stderr.on('data', (data) => {
    console.log(`ffmpeg error: ${data}`);
  });

  ffmpeg.on('close', () => {
    console.log('ffmpeg process closed');
    browser.close();
  });

})();
