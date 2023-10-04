import { useState } from 'react';
import { extractVideoId, getCaption, handleCopy } from './utils';
import Spinner from './components/spinner';

function App() {
  const [videoUrl, setVideoUrl] = useState(
    'https://www.youtube.com/watch?v=r2W7tHV70Fg'
  );
  const [captions, setCaptions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean | null>(null);

  const fetchEnglishCaptions = async () => {
    try {
      setIsLoading(true);
      setError('');
      setCaptions('');

      // Extract video ID from the YouTube URL
      const videoID = extractVideoId(videoUrl);

      if (!videoID) {
        throw new Error('Invalid YouTube video URL');
      }

      const captionData = await getCaption(videoID);
      console.log(captionData);

      if (captionData && captionData!.length > 0) {
        // Join captions with empty lines between each line
        const formattedCaptions = captionData!
          .map((line) => line.text.split('\n').join(' '))
          .join('\n\n');
        setCaptions(formattedCaptions);
      } else {
        setError('Captions not found for this video.');
      }
    } catch (error) {
      console.error('Error fetching captions:', error);
      setError('Error fetching captions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen p-6 md:p-12 flex items-center justify-center bg-gray-100'>
      <div className='w-full p-6 bg-white rounded-lg shadow'>
        <h1 className='text-2xl font-semibold mb-4'>
          YouTube Captions Extractor
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchEnglishCaptions();
          }}
        >
          <input
            type='text'
            placeholder='Enter YouTube Video URL'
            className='w-full px-4 py-2 border rounded-md mb-4'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            className='w-full bg-blue-600 disabled:bg-blue-400 transition text-white py-2 rounded-md mb-4'
            onClick={fetchEnglishCaptions}
            disabled={isLoading !== null && isLoading}
          >
            Extract English Captions
          </button>
        </form>
        {isLoading ? (
          <p className='text-center flex justify-center items-center'>
            <span className='mr-2'>
              <Spinner />
            </span>
            <span>Extracting captions...</span>
          </p>
        ) : error && isLoading !== null ? (
          <p className='text-red-500'>{error}</p>
        ) : (
          captions && (
            <>
              <textarea
                rows={15}
                className='p-3 border-gray-300 border rounded w-full mb-2 whitespace-pre-line'
              >
                {captions}
              </textarea>
              <button
                className='w-full bg-green-500 text-white py-2 rounded-md'
                onClick={() => handleCopy(captions)}
              >
                Copy Captions
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default App;
