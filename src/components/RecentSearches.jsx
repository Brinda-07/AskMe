import React from 'react'

const RecentSearches = ({ history, setQuery, setSelectedHistory, askQuestion, setHistory }) => {
  const clearHistory = () => {
    localStorage.clear();
    setHistory([]);
  };

  return (
    <div className="col-span-1 dark:bg-zinc-600 bg-red-200 pt-5">
      <h1 className="text-xl text-white flex justify-center items-center gap-2 px-2">
        <span className='dark:text-zinc-300 text-zinc-800 '>Recent Searches</span>
        <button onClick={clearHistory} className="cursor-pointer">
          {/* Trash Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#e3e3e3">
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </h1>

      <ul className="text-left overflow-auto h-[90%] px-2">
        {history.map((item, index) => (
          <li
            key={index}
            onClick={() => {
              setQuery('');
              setSelectedHistory(item);
              setTimeout(() => askQuestion(), 0);
            }}
            className="p-2 pl-4 dark:text-zinc-400 text-zinc-800 cursor-pointer dark:hover:bg-zinc-700 hover:bg-amber-100 dark:hover:text-white truncate hover:text-zinc-500"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearches;
