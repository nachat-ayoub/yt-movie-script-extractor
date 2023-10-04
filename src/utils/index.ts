import copy from 'clipboard-copy';
import axios from 'axios';

function extractVideoId(url: string): string | null {
  const videoIdMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/v\/)([^\?&"'>]+)/
  );
  return videoIdMatch ? videoIdMatch[1] : null;
}

const handleCopy = (text: string) => {
  copy(
    `can you format this text in a readable way in paragraphs:

` + text
  );
  alert('Captions copied to clipboard');
};

async function getCaption(videoID: string): Promise<captionData[] | null> {
  try {
    const API = 'https://yt-caption-api.onrender.com/api?videoID=' + videoID;
    const resp = await axios.get(API);
    if (resp.status == 200) {
      return resp.data.data;
    }

    return null;
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
