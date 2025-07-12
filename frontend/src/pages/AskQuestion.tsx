import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function AskQuestionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isMCQ, setIsMCQ] = useState(false);
  const [mcqOptions, setMcqOptions] = useState(['']);
  const [correctOption, setCorrectOption] = useState<number | null>(null);

  const handleTagAdd = () => {
    if (tagInput && tags.length < 5 && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleTagRemove = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions[index] = value;
    setMcqOptions(updatedOptions);
  };

  const handleAddOption = () => {
    setMcqOptions([...mcqOptions, '']);
  };

  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...mcqOptions];
    updatedOptions.splice(index, 1);
    setMcqOptions(updatedOptions);
    if (correctOption === index) setCorrectOption(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ title, description, tags, isMCQ, mcqOptions, correctOption });
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Form */}
      <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Ask a Question</h2>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 text-sm font-medium mb-1">Question Title *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What's your programming question? Be specific."
            className="w-full px-4 py-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-medium">Question Details *</label>
            <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">Preview</span>
          </div>
          <ReactQuill
            value={description}
            onChange={setDescription}
            placeholder="Provide detailed description..."
            className="mb-6"
          />

          <label className="block text-gray-700 text-sm font-medium mb-1">Tags (up to 5)</label>
          <div className="flex items-center gap-2 mb-3">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g., react, nodejs"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <button type="button" onClick={handleTagAdd} className="px-3 py-2 bg-blue-600 text-white rounded-lg">+</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1"
              >
                {tag}
                <button onClick={() => handleTagRemove(index)} className="text-blue-800 hover:text-red-600">&times;</button>
              </span>
            ))}
          </div>

          <div className="flex items-center mb-4">
            <input type="checkbox" checked={isMCQ} onChange={() => setIsMCQ(!isMCQ)} className="mr-2" />
            <label className="text-sm font-medium text-gray-800">Add MCQ options</label>
          </div>

          {isMCQ && (
            <div className="mb-6">
              {mcqOptions.map((opt, index) => (
                <div key={index} className="flex items-center mb-2 gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correctOption === index}
                    onChange={() => setCorrectOption(index)}
                    title="Mark as correct"
                    className="accent-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="mt-2 text-blue-600 hover:underline text-sm"
              >
                + Add Option
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900 transition"
          >
            Post Question
          </button>
        </form>
      </div>

      {/* Side Tips Panel */}
      <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">How to ask a great question</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Write a clear, specific title</li>
            <li>Explain what you've tried and what went wrong</li>
            <li>Include relevant code or screenshots</li>
            <li>Add relevant tags to categorize</li>
            <li>Be respectful and constructive</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Popular Tags</h3>
          <div className="flex flex-wrap gap-2">
            {['javascript', 'react', 'nodejs', 'python', 'html', 'css', 'database'].map(tag => (
              <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 text-xs rounded-full">{tag}</span>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <strong>MCQ Tip:</strong> If your question has one correct answer from several choices, turn on the MCQ option and specify the correct one.
        </div>
      </div>
    </div>
  );
}
