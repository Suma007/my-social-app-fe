import React from 'react';

const renderHeadings = (tags) => {
  return tags?.map((heading, index) => {
    const colorClass = `tag-color-${index % 2 + 1}`;
    return (
      <div key={index} className={`tag-box ${colorClass}`}>
        {heading.content_value}
      </div>
    );
  });
};

export default renderHeadings;
