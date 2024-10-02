const puppeteer = require('puppeteer');
const { spawn } = require('child_process');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,  // Lancer sans interface graphique
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Définir la résolution de capture
  await page.setViewport({ width: 1920, height: 1080 });
  
  // Charger la page web que tu veux streamer
  await page.goto('http://discode-studio.github.io/shortwave.bot/4625waterfall.html', { waitUntil: 'networkidle2' });
  
  // Capture vidéo de la page
  const ffmpeg = spawn('ffmpeg', [
    '-y', 
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-i', 'pipe:0', 
    '-vf', 'scale=1920:1080',
    '-c:v', 'libx264',  // Utilisation de libx264 pour encoder la vidéo
    '-preset', 'fast',  // Réglage pour l'encodage rapide
    '-b:v', '4500k',
    '-maxrate', '5000k',
    '-bufsize', '6000k',
    '-pix_fmt', 'yuv420p',
    '-g', '60', // GOP de 2 secondes pour 30fps
    '-f', 'flv',
    'rtmp://a.rtmp.youtube.com/live2/sz87-dusv-psay-wsra-5xms'  // Utiliser la clé RTMP depuis les secrets GitHub
  ]);

  // Stream la capture de la page vers ffmpeg
  const streamVideo = async () => {
    try {
      const screenshot = await page.screenshot({ type: 'jpeg' });
      ffmpeg.stdin.write(screenshot);
    } catch (error) {
      console.error('Erreur lors de la capture d\'écran:', error);
    }
  };

  // Capture les images toutes les 33ms (~30 fps)
  setInterval(streamVideo, 33);

  // Événements en cas d'erreur avec ffmpeg
  ffmpeg.stderr.on('data', (data) => {
    console.error(`ffmpeg error: ${data}`);
  });

  ffmpeg.on('close', () => {
    console.log('ffmpeg process closed');
    browser.close();
  });

  // Gérer les erreurs de Puppeteer
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    browser.close();
  });

  // Fermer le navigateur en cas d'interruption
  process.on('SIGINT', async () => {
    console.log('Fermeture du navigateur...');
    await browser.close();
    process.exit();
  });

})();
