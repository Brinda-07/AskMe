import { useEffect, useState, useRef } from 'react';
import './App.css';
import { url } from './assets/constants';
import Answer from './components/Answer';
import RecentSearches from './components/RecentSearches';

function App() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState('');
  const scrolltoans = useRef();
  const [loader, setloader] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('history')) || [];
    setHistory(saved);
  }, []);

  const askQuestion = async () => {
    const usedQuery = query || selectedHistory;
    if (!usedQuery) return;

    const existingHistory = JSON.parse(localStorage.getItem('history')) || [];
    if (!existingHistory.includes(usedQuery)) {
      const updatedHistory = [usedQuery, ...existingHistory];
      localStorage.setItem('history', JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    }

    const payload = {
      contents: [
        {
          parts: [
            {
              text: usedQuery
            }
          ]
        }
      ]
    };

    try {
      setloader(true);
      let response = await fetch(
        url + 'AIzaSyDy9AdIIIp3VixhTGA8swS2_6PBzMBq4Bc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      );

      response = await response.json();
      let dataString = response.candidates[0].content.parts[0].text;
      dataString = dataString.split('* ').map(item => item.trim());

      setResult(prev => [
        ...prev,
        { type: 'q', text: usedQuery },
        ...dataString.map(item => ({ type: 'a', text: item }))
      ]);

      setQuery('');
      setSelectedHistory('');
    } catch (error) {
      console.error('Failed to fetch answer:', error);
    }

    setTimeout(() => {
      scrolltoans.current.scrollTop = scrolltoans.current.scrollHeight;
    }, 500);

    setloader(false);
  };

 

  const isEnter = event => {
    if (event.key === 'Enter') {
      askQuestion();
    }
  };
  //darkmode
  const [dark, setdark] = useState('dark')
  useEffect(()=>{
if(dark=='dark'){
document.documentElement.classList.add('dark');
}
else{
document.documentElement.classList.remove('dark');
}
  },[dark]
  )

  return (
    <div className={dark=='dark'?'dark':'light'}>
    <div className="grid grid-cols-5 h-screen text-center">
     <select
  onChange={(event) => setdark(event.target.value)}
  value={dark}
  className="fixed bottom-0 left-0 z-50 m-4 px-4 py-2 bg-zinc-800 text-white border border-zinc-700 rounded-md shadow-sm focus:outline-none"
>
  <option value="dark" className="bg-zinc-800 text-white">Dark</option>
  <option value="light" className="bg-white text-black">Light</option>
</select>
   <RecentSearches 
  history={history} 
  setQuery={setQuery} 
  setSelectedHistory={setSelectedHistory} 
  askQuestion={askQuestion} 
  setHistory={setHistory}
/>

      <div className="col-span-4 px-6 pt-8 pb-4">
        <h1 className="text-3xl font-poppins text-center text-purple-500 mb-6">
          Hello User, Ask Me Anything
        </h1>

        {loader ? (
          <div role="status">
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        ) : null}

        <div
          ref={scrolltoans}
          className="container h-130 max-h-[70vh] overflow-auto text-white custom-scroll pr-3"
        >
          <ul>
            {result.map((item, index) => (
              <li
                key={index + '-' + item.type}
                className={`my-2 max-w-[75%] px-4 py-2 shadow-sm overflow-hidden break-words w-fit text-white
                  ${item.type === 'q'
                    ? 'ml-auto  text-right dark:bg-zinc-700 bg-red-200  rounded-tl-3xl rounded-br-3xl rounded-bl-3xl'
                    : 'mr-auto text-left'
                  }`}
              >
                <Answer ans={item.text} totalresult={result} index={index} />
              </li>
            ))}
          </ul>
        </div>

        <div className="dark:bg-zinc-600 bg-red-200  w-1/2 h-14 p-1 pr-5 dark:text-white text-zinc-800 m-auto rounded-4xl border border-white flex mt-4">
          <input
            type="text"
            value={query}
            onKeyDown={isEnter}
            onChange={e => setQuery(e.target.value)}
            className="w-full h-full p-3 bg-transparent outline-none"
            placeholder="Ask Me Anything"
          />
          <button onClick={askQuestion} className="px-4 py-2">
            ASK
          </button>
        </div>
      </div>
    </div>
     </div>
  );
 
}

export default App;
