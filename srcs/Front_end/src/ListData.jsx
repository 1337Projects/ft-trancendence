import { useState } from "react"


export default function List() {

  const [planesData, setPlanesData] = useState(Data.childPlaces);

  function deleteHandler(id) {
    let tmp = planesData.slice();
    tmp.forEach((item, index) => {
      if (item.id === id)
          tmp.splice(index, 1);
      item.childPlaces.forEach((i, index) => {
        if (i.id === id)
            item.childPlaces.splice(index, 1)
        i.childPlaces.forEach((l, index) => {
          if (l.id === id)
            i.childPlaces.splice(index, 1);
        })
      })
    })
    setPlanesData(tmp);
  }

  return (
    <ol>
      {
        planesData.map(item => {
          return (
            <li key={item.id}>
              <div className='flex w-20 justify-between mt-2'>
                <h1 className='text-[12px]'>{item.title}</h1>
                <button className='bg-red-300 rounded px-1 text-[8px] text-white' onClick={() => deleteHandler(item.id)}>delete</button>
              </div>
              <ul className='ml-10'>
                {item.childPlaces.map(p => {
                  return (
                    <li key={p.id}>
                      <div className='flex justify-between w-36 mt-2'>
                        <p className='text-[8px]'>{p.title}</p>
                        <button className='text-white bg-red-300 rounded p-1 text-[8px]' onClick={() => deleteHandler(p.id)}>delete</button>
                      </div>
                      <ul className='ml-20'>
                        {
                          p.childPlaces.map(c => {
                            return (
                              <li key={c.id} className='flex justify-between w-36 mt-2'>
                                <p className='text-[8px]'>{c.title}</p>
                                <button className='text-white bg-red-300 rounded p-1 text-[8px]' onClick={() => deleteHandler(c.id)}>delete</button>
                              </li>
                            )
                          })
                        }
                      </ul>
                    </li>
                  )
                })}
              </ul>
            </li>)})
      }
    </ol>
  )
}


export const Data = {
    id: 0,
    title: '(Root)',
    childPlaces: [{
      id: 1,
      title: 'Earth',
      childPlaces: [{
        id: 2,
        title: 'Africa',
        childPlaces: [{
          id: 3,
          title: 'Botswana',
          childPlaces: []
        }, {
          id: 4,
          title: 'Egypt',
          childPlaces: []
        }, {
          id: 5,
          title: 'Kenya',
          childPlaces: []
        }, {
          id: 6,
          title: 'Madagascar',
          childPlaces: []
        }, {
          id: 7,
          title: 'Morocco',
          childPlaces: []
        }, {
          id: 8,
          title: 'Nigeria',
          childPlaces: []
        }, {
          id: 9,
          title: 'South Africa',
          childPlaces: []
        }]
      }, {
        id: 10,
        title: 'Americas',
        childPlaces: [{
          id: 11,
          title: 'Argentina',
          childPlaces: []
        }, {
          id: 12,
          title: 'Brazil',
          childPlaces: []
        }, {
          id: 13,
          title: 'Barbados',
          childPlaces: []
        }, {
          id: 14,
          title: 'Canada',
          childPlaces: []
        }, {
          id: 15,
          title: 'Jamaica',
          childPlaces: []
        }, {
          id: 16,
          title: 'Mexico',
          childPlaces: []
        }, {
          id: 17,
          title: 'Trinidad and Tobago',
          childPlaces: []
        }, {
          id: 18,
          title: 'Venezuela',
          childPlaces: []
        }]
      }, {
        id: 19,
        title: 'Asia',
        childPlaces: [{
          id: 20,
          title: 'China',
          childPlaces: []
        }, {
          id: 21,
          title: 'India',
          childPlaces: []
        }, {
          id: 22,
          title: 'Singapore',
          childPlaces: []
        }, {
          id: 23,
          title: 'South Korea',
          childPlaces: []
        }, {
          id: 24,
          title: 'Thailand',
          childPlaces: []
        }, {
          id: 25,
          title: 'Vietnam',
          childPlaces: []
        }]
      }, {
        id: 26,
        title: 'Europe',
        childPlaces: [{
          id: 27,
          title: 'Croatia',
          childPlaces: [],
        }, {
          id: 28,
          title: 'France',
          childPlaces: [],
        }, {
          id: 29,
          title: 'Germany',
          childPlaces: [],
        }, {
          id: 30,
          title: 'Italy',
          childPlaces: [],
        }, {
          id: 31,
          title: 'Portugal',
          childPlaces: [],
        }, {
          id: 32,
          title: 'Spain',
          childPlaces: [],
        }, {
          id: 33,
          title: 'Turkey',
          childPlaces: [],
        }]
      }, {
        id: 34,
        title: 'Oceania',
        childPlaces: [{
          id: 35,
          title: 'Australia',
          childPlaces: [],
        }, {
          id: 36,
          title: 'Bora Bora (French Polynesia)',
          childPlaces: [],
        }, {
          id: 37,
          title: 'Easter Island (Chile)',
          childPlaces: [],
        }, {
          id: 38,
          title: 'Fiji',
          childPlaces: [],
        }, {
          id: 39,
          title: 'Hawaii (the USA)',
          childPlaces: [],
        }, {
          id: 40,
          title: 'New Zealand',
          childPlaces: [],
        }, {
          id: 41,
          title: 'Vanuatu',
          childPlaces: [],
        }]
      }]
    }, {
      id: 42,
      title: 'Moon',
      childPlaces: [{
        id: 43,
        title: 'Rheita',
        childPlaces: []
      }, {
        id: 44,
        title: 'Piccolomini',
        childPlaces: []
      }, {
        id: 45,
        title: 'Tycho',
        childPlaces: []
      }]
    }, {
      id: 46,
      title: 'Mars',
      childPlaces: [{
        id: 47,
        title: 'Corn Town',
        childPlaces: []
      }, {
        id: 48,
        title: 'Green Hill',
        childPlaces: []      
      }]
    }]
  };
  