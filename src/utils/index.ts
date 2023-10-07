import copy from 'clipboard-copy';
import axios from 'axios';

function extractVideoId(url: string): string | null {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/v\/)([^\?&"'>]+)/
  );
  return videoIdMatch ? videoIdMatch[1] : null;
}

const handleCopy = (text: string, prompt = false) => {
  copy(
    (prompt
      ? `can you format this text in a readable way in paragraphs:

`
      : '') + text
  );
  // alert('Captions copied to clipboard');
};

async function getCaption(
  videoID: string
): Promise<captionData[] | string | null> {
  try {
    const API = 'https://yt-caption-api.onrender.com/api?videoID=' + videoID;

    // Create a promise that resolves after 7 seconds
    const timeoutPromise = new Promise<string>((resolve) => {
      setTimeout(() => {
        resolve('Request timed out');
      }, 7000); // 7 seconds
    });

    // Use Promise.race to race between the request and the timeout
    const result = await Promise.race([
      axios.get(API).then((resp) => resp.data.data), // The actual request
      timeoutPromise, // The timeout promise
    ]);

    if (typeof result === 'string' && result === 'Request timed out') {
      return 'The request timed out after 7 seconds';
    } else {
      return result; // Return the response data or null if an error occurred
    }
  } catch (error) {
    console.log(error);
    return null;
  }
}

interface captionData {
  start: number;
  dur: number;
  text: string;
}

export { extractVideoId, getCaption, handleCopy };
export type { captionData };
