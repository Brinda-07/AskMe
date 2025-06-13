import React, { useEffect, useState } from 'react';
import { checkHeading, replaceHeading } from '../helper';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Answer = ({ ans, totalresult, index }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);
  const [typing, settyping] = useState('')

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeading(ans));
      settyping(replaceHeading(ans));
    }
    
  }, [ans]);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          language={match[1]}
          style={dark}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalresult.length === 0 || heading ? (
        <span className="pt-2 text-lg block font-bold dark:text-white text-zinc-800">
          {answer}
        </span>
      ) : (
        <span className="dark:text-white text-zinc-800">
          <ReactMarkdown components={renderer}>
            {answer}
          </ReactMarkdown>
        </span>
      )}
    </>
  );
};

export default Answer;
