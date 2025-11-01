import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import Quill from 'quill';
import { JobCategories, JobLocations } from '../../assets/assets';

const AddJob = () => {

const [title, setTitle] =useState('');
const [location, setLocation] =useState('Bangalore');
const [category, setCategory] =useState('Engineering');
const [level, setLevel] =useState('Internship');
const [salary, setSalary] =useState(0);

const editorref =useRef(null);
const quillref =useRef(null);

useEffect(() => {
  if (!quillref.current && editorref.current) {
    quillref.current = new Quill(editorref.current, {
      theme: 'snow',
    });
  }
}, []);

return (
  <form className='container p-4 flex flex-col w-full items-start gap-3'>
    <div className='w-full'>
      <p className='mb-2'>Job Title</p>
      <input type="text" placeholder='Type here' 
      onChange={e => setTitle(e.target.value)} value={title} required
      className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
      
    </div>
    <div className='w-full max-w-lg'>
      <p className='my-2'>Job Description</p>
      <div ref={editorref}>

      </div>
    </div>

    <div className='flex flex-col sm:flex-row gap-2 sm:gap-8'>
      
      <div>
        <p className='mb-2'>Job Category</p>
        <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setCategory(e.target.value)}>
          {JobCategories.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <p className='mb-2'>Job Location</p>
        <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLocation(e.target.value)}>
          {JobLocations.map((loc, index) => (
            <option key={index} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      <div>
        <p className='mb-2'>Job Level</p>
        <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e => setLevel(e.target.value)}>
          <option value="Beginner-level"> Beginner-level</option>
           <option value="Intermediate-level">Intermediate-level</option>
            <option value="Senior-level">Senior-level</option>
        </select>
      </div>
    </div>

    <div>
      <p className='mb-2'>Job Salary</p>
      <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]' onChange={e => setSalary(e.target.value)} type="Number" placeholder='2500' />
    </div>

    <button className='w-28 py-3 mt-4 bg-black text-white rounded'>Add</button>
  </form>
)
}

export default AddJob