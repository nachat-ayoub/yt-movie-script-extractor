import { extractVideoId, getCaption, handleCopy } from './utils';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from './components/Spinner';
import { useState } from 'react';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [videoUrl, setVideoUrl] = useState(
    'https://www.youtube.com/watch?v=r2W7tHV70Fg'
  );
  const [captions, setCaptions] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState<boolean | null>(null);
  const notify = (message: string = 'Wow so easy!', success = false) => {
    toast[success ? 'success' : 'error'](message, {
      autoClose: 6000,
    });
  };

  const fetchEnglishCaptions = async () => {
    try {
      setIsLoading(true);
      setError('');
      setCaptions('');

      // Extract video ID from the YouTube URL
      const videoID = extractVideoId(videoUrl);

      if (!videoID) {
        throw 'Invalid YouTube video URL';
      }

      const captionData = await getCaption(videoID);

      if (typeof captionData == 'string') {
        setIsLoading(false);
        throw 'Something went wrong or the API is sleeping. please try to wake the API up by pressing the "wake up API" red button';
      }

      if (captionData && captionData!.length > 0) {
        // Join captions with empty lines between each line
        const formattedCaptions = captionData!
          .map((line) => line.text.split('\n').join(' '))
          .join('\n\n');
        setCaptions(formattedCaptions);
      } else {
        throw 'Captions not found for this video.';
      }
    } catch (error) {
      console.error('Error fetching captions:', error);
      setError(error as string);
    } finally {
      setIsLoading(false);
      const message = error || 'Caption extracted successfully!';
      const success = error ? false : true;
      notify(message, success);
    }
  };

  return (
    <div className='min-h-screen p-6 md:p-12 flex items-center justify-center bg-gray-100'>
      <ToastContainer />

      <div className='w-full p-6 bg-white rounded-lg shadow'>
        <div className='w-full flex flex-col md:flex-row justify-between items-center'>
          <div className='flex gap-2 items-center'>
            <img
              className='w-20'
              src='/logo.svg'
              alt='YouTube Caption Extractor'
            />
            <h1 className='text-2xl font-semibold'>
              YouTube Caption Extractor
            </h1>
          </div>

          <a
            className='w-full md:w-fit mt-2 md:mt-0 text-white text-center bg-red-600 hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-md cursor-pointer'
            href='https://yt-caption-api.onrender.com/api'
            target='_blank'
          >
            <i className='fa-solid fa-bell mr-2'></i>
            Wake up the API
          </a>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchEnglishCaptions();
          }}
        >
          <input
            type='text'
            placeholder='Enter YouTube Video URL'
            className='w-full px-4 py-2 border rounded-md my-4'
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
          />
          <button
            className='w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium text-sm px-5 py-2.5 focus:outline-none rounded-md mb-4'
            onClick={fetchEnglishCaptions}
            disabled={isLoading !== null && isLoading}
          >
            Extract English Caption
          </button>
        </form>
        <div className='w-full text-center'>
          {isLoading ? (
            <p className='flex justify-center items-center'>
              <span className='mr-2'>
                <Spinner />
              </span>
              <span>Extracting caption...</span>
            </p>
          ) : error && isLoading !== null ? (
            <p className='text-red-500 font-semibold'>{error}</p>
          ) : (
            captions && (
              <>
                <textarea
                  className='min-h-[calc(100vh-(422px+4rem))] md:min-h-[calc(100vh-(300px+7rem))] border-gray-300 border rounded w-full p-3 mb-2 whitespace-pre-line'
                  defaultValue={captions}
                ></textarea>
                <div className='w-full flex flex-col md:flex-row md:justify-between gap-y-3 gap-x-8'>
                  <button
                    className='w-full flex justify-center items-center text-white bg-amber-400 hover:bg-amber-500 focus:ring-4 focus:ring-amber-300 font-medium text-base px-5 py-2.5 focus:outline-none rounded-md'
                    type='button'
                    onClick={() => {
                      handleCopy(captions);
                      notify('Caption Copied Successfully', true);
                    }}
                  >
                    <span className='mr-3 text-2xl'>
                      <i className='fa-regular fa-closed-captioning'></i>
                    </span>

                    <span>Copy Caption</span>
                  </button>
                  <button
                    className='w-full flex justify-center items-center text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium text-base px-5 py-2.5 focus:outline-none rounded-md'
                    type='button'
                    onClick={() => {
                      handleCopy(captions, true);
                      notify('Prompt Copied Successfully', true);
                    }}
                  >
                    <span className='mr-3'>
                      <svg
                        className='w-8'
                        xmlns='http://www.w3.org/2000/svg'
                        x='0px'
                        y='0px'
                        viewBox='0 0 30 30'
                        fill='currentColor'
                      >
                        <path d='M 14.070312 2 C 11.330615 2 8.9844456 3.7162572 8.0390625 6.1269531 C 6.061324 6.3911222 4.2941948 7.5446684 3.2773438 9.3066406 C 1.9078196 11.678948 2.2198602 14.567816 3.8339844 16.591797 C 3.0745422 18.436097 3.1891418 20.543674 4.2050781 22.304688 C 5.5751778 24.677992 8.2359331 25.852135 10.796875 25.464844 C 12.014412 27.045167 13.895916 28 15.929688 28 C 18.669385 28 21.015554 26.283743 21.960938 23.873047 C 23.938676 23.608878 25.705805 22.455332 26.722656 20.693359 C 28.09218 18.321052 27.78014 15.432184 26.166016 13.408203 C 26.925458 11.563903 26.810858 9.4563257 25.794922 7.6953125 C 24.424822 5.3220082 21.764067 4.1478652 19.203125 4.5351562 C 17.985588 2.9548328 16.104084 2 14.070312 2 z M 14.070312 4 C 15.226446 4 16.310639 4.4546405 17.130859 5.2265625 C 17.068225 5.2600447 17.003357 5.2865019 16.941406 5.3222656 L 12.501953 7.8867188 C 12.039953 8.1527187 11.753953 8.6456875 11.751953 9.1796875 L 11.724609 15.146484 L 9.5898438 13.900391 L 9.5898438 8.4804688 C 9.5898438 6.0104687 11.600312 4 14.070312 4 z M 20.492188 6.4667969 C 21.927441 6.5689063 23.290625 7.3584375 24.0625 8.6953125 C 24.640485 9.696213 24.789458 10.862812 24.53125 11.958984 C 24.470201 11.920997 24.414287 11.878008 24.351562 11.841797 L 19.910156 9.2773438 C 19.448156 9.0113437 18.879016 9.0103906 18.416016 9.2753906 L 13.236328 12.236328 L 13.248047 9.765625 L 17.941406 7.0546875 C 18.743531 6.5915625 19.631035 6.4055313 20.492188 6.4667969 z M 7.5996094 8.2675781 C 7.5972783 8.3387539 7.5898438 8.4087418 7.5898438 8.4804688 L 7.5898438 13.607422 C 7.5898438 14.141422 7.8729844 14.635297 8.3339844 14.904297 L 13.488281 17.910156 L 11.34375 19.134766 L 6.6484375 16.425781 C 4.5094375 15.190781 3.7747656 12.443687 5.0097656 10.304688 C 5.5874162 9.3043657 6.522013 8.5923015 7.5996094 8.2675781 z M 18.65625 10.865234 L 23.351562 13.574219 C 25.490562 14.809219 26.225234 17.556313 24.990234 19.695312 C 24.412584 20.695634 23.477987 21.407698 22.400391 21.732422 C 22.402722 21.661246 22.410156 21.591258 22.410156 21.519531 L 22.410156 16.392578 C 22.410156 15.858578 22.127016 15.364703 21.666016 15.095703 L 16.511719 12.089844 L 18.65625 10.865234 z M 15.009766 12.947266 L 16.78125 13.980469 L 16.771484 16.035156 L 14.990234 17.052734 L 13.21875 16.017578 L 13.228516 13.964844 L 15.009766 12.947266 z M 18.275391 14.853516 L 20.410156 16.099609 L 20.410156 21.519531 C 20.410156 23.989531 18.399687 26 15.929688 26 C 14.773554 26 13.689361 25.54536 12.869141 24.773438 C 12.931775 24.739955 12.996643 24.713498 13.058594 24.677734 L 17.498047 22.113281 C 17.960047 21.847281 18.246047 21.354312 18.248047 20.820312 L 18.275391 14.853516 z M 16.763672 17.763672 L 16.751953 20.234375 L 12.058594 22.945312 C 9.9195938 24.180312 7.1725 23.443687 5.9375 21.304688 C 5.3595152 20.303787 5.2105423 19.137188 5.46875 18.041016 C 5.5297994 18.079003 5.5857129 18.121992 5.6484375 18.158203 L 10.089844 20.722656 C 10.551844 20.988656 11.120984 20.989609 11.583984 20.724609 L 16.763672 17.763672 z'></path>
                      </svg>
                    </span>

                    <span>Copy Prompt</span>
                  </button>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
