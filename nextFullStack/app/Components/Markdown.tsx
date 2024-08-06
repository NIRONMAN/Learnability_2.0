import React from 'react';
import markdownit from 'markdown-it';
import DOMPurify from 'dompurify';

const md = markdownit({
        linkify:true
});

type Props = {
    rawText: string
}

const MarkdownContent = ({ rawText }: Props) => {
    const result = md.render(rawText);
    const clean = DOMPurify.sanitize(result);
    
    md
    return (
        <div className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: clean }}></div>
    );
}

export default MarkdownContent;