

const products = [
  {
    "_id": "69fc5910f87dd69dc5aa47f0",
    "name": "Bike Brake Pads",
    "price": 800,
    "category": "Bike",
    "vehicle": [
      {
        "brand": "Honda",
        "model": [
          "Shine",
          "SP 125"
        ],
        "_id": "69fc5910f87dd69dc5aa47f1"
      }
    ],
    "images": [],
    "description": "Durable brake pads for commuter bikes",
    "stock": 50,
    "isFeatured": false
  },
  {
    "_id": "69fc5986f87dd69dc5aa47f4",
    "name": "Royal Enfield Chain Set",
    "price": 2200,
    "category": "Bike",
    "vehicle": [
      {
        "brand": "Royal Enfield",
        "model": [
          "Classic 350",
          "Bullet 350"
        ],
        "_id": "69fc5986f87dd69dc5aa47f5"
      }
    ],
    "images": [],
    "description": "Heavy-duty chain set for long rides",
    "stock": 30,
    "isFeatured": true
  },
  {
    "_id": "69fc59c7f87dd69dc5aa47f8",
    "name": "Yamaha Clutch Plate",
    "price": 1500,
    "category": "Bike",
    "vehicle": [
      {
        "brand": "Yamaha",
        "model": [
          "R15 V4",
          "MT 15 V2"
        ],
        "_id": "69fc59c7f87dd69dc5aa47f9"
      }
    ],
    "images": [],
    "description": "OEM clutch plate for smooth gear shifts",
    "stock": 40,
    "isFeatured": false
  },
  {
    "_id": "69fc5e57f87dd69dc5aa4808",
    "name": "TVS Apache Disc Rotor",
    "price": 1800,
    "category": "Bike",
    "vehicle": [
      {
        "brand": "TVS",
        "model": [
          "Apache RTR 160",
          "Raider 125",
          "Ronin"
        ],
        "_id": "69fc5e57f87dd69dc5aa4809"
      }
    ],
    "images": [],
    "description": "Front disc rotor for TVS Apache series",
    "stock": 25,
    "isFeatured": false
  },
  {
    "_id": "69fc5e97f87dd69dc5aa480c",
    "name": "Hero Splendor Headlight",
    "price": 950,
    "category": "Bike",
    "vehicle": [
      {
        "brand": "Hero",
        "model": [
          "Splendor Plus",
          "HF Deluxe",
          "Glamour"
        ],
        "_id": "69fc5e97f87dd69dc5aa480d"
      }
    ],
    "images": [],
    "description": "Bright halogen headlight for Hero commuter bikes",
    "stock": 60,
    "isFeatured": false
  },
  {
    "_id": "69fc5ec6f87dd69dc5aa4810",
    "name": "Maruti Suzuki Air Filter",
    "price": 1200,
    "category": "Car",
    "vehicle": [
      {
        "brand": "Maruti Suzuki",
        "model": [
          "Swift",
          "Baleno"
        ],
        "_id": "69fc5ec6f87dd69dc5aa4811"
      }
    ],
    "images": [],
    "description": "OEM air filter for Maruti hatchbacks",
    "stock": 70,
    "isFeatured": false
  },
  {
    "_id": "69fc5efbf87dd69dc5aa4814",
    "name": "Tata Nexon Brake Disc",
    "price": 3500,
    "category": "Car",
    "vehicle": [
      {
        "brand": "Tata Motors",
        "model": [
          "Nexon",
          "Harrier"
        ],
        "_id": "69fc5f7df87dd69dc5aa482f"
      }
    ],
    "images": [],
    "description": "Front brake disc for Tata SUVs",
    "stock": 20,
    "isFeatured": true,
    "createdAt": {
      "$date": "2026-05-07T09:44:27.977Z"
    },
    "updatedAt": {
      "$date": "2026-05-07T09:46:37.828Z"
    },
    "__v": 1
  },
  {
    "_id": "69fc5f6ff87dd69dc5aa4829",
    "name": "Hyundai Creta Shock Absorber",
    "price": 4200,
    "category": "Car",
    "vehicle": [
      {
        "brand": "Hyundai",
        "model": [
          "Creta",
          "Venue"
        ],
        "_id": "69fc5f6ff87dd69dc5aa482a"
      }
    ],
    "images": [],
    "description": "Rear shock absorber for Hyundai SUVs",
    "stock": 15,
    "isFeatured": false
  },
  {
    "_id": "69fc6013f87dd69dc5aa4832",
    "name": "Mahindra Thar Clutch Kit",
    "price": 5500,
    "category": "Car",
    "vehicle": [
      {
        "brand": "Mahindra",
        "model": [
          "Thar",
          "Scorpio N"
        ],
        "_id": "69fc6013f87dd69dc5aa4833"
      }
    ],
    "images": [],
    "description": "Heavy-duty clutch kit for Mahindra off-roaders",
    "stock": 10,
    "isFeatured": true
  },
  {
    "_id": "69fc604ef87dd69dc5aa4836",
    "name": "Toyota Innova Fuel Pump",
    "price": 4800,
    "category": "Car",
    "vehicle": [
      {
        "brand": "Toyota",
        "model": [
          "Innova Hycross",
          "Fortuner",
          "Urban Cruiser Hyryder"
        ],
        "_id": "69fc604ef87dd69dc5aa4837"
      }
    ],
    "images": [],
    "description": "Reliable fuel pump for Toyota MPVs",
    "stock": 12,
    "isFeatured": false
  },
  {
    "_id": "69fc60bcf87dd69dc5aa484b",
    "name": "Bike Mobile Holder",
    "price": 600,
    "category": "Accessories",
    "vehicle": [
      {
        "brand": "Universal",
        "model": [
          "Bikes"
        ],
        "_id": "69fc60bcf87dd69dc5aa484c"
      }
    ],
    "images": [],
    "description": "Sturdy mobile holder for bikes",
    "stock": 100,
    "isFeatured": true
  },
  {
    "_id": "69fc6120f87dd69dc5aa484f",
    "name": "Car Seat Covers",
    "price": 2500,
    "category": "Accessories",
    "vehicle": [
      {
        "brand": "Maruti Suzuki",
        "model": [
          "Swift",
          "Ertiga"
        ],
        "_id": "69fc6120f87dd69dc5aa4850"
      },
      {
        "brand": "Tata Motors",
        "model": [
          "Nexon",
          "Harrier"
        ],
        "_id": "69fc6120f87dd69dc5aa4851"
      },
      {
        "brand": "Hyundai",
        "model": [
          "i20"
        ],
        "_id": "69fc6120f87dd69dc5aa4852"
      },
      {
        "brand": "Kia",
        "model": [
          "Carens",
          "Sonet"
        ],
        "_id": "69fc6120f87dd69dc5aa4853"
      }
    ],
    "images": [],
    "description": "Premium seat covers for comfort and style",
    "stock": 40,
    "isFeatured": false
  },
  {
    "_id": "69fc614af87dd69dc5aa4856",
    "name": "Bike Riding Gloves",
    "price": 900,
    "category": "Accessories",
    "vehicle": [
      {
        "brand": "Universal",
        "model": [
          "Bikes"
        ],
        "_id": "69fc614af87dd69dc5aa4857"
      }
    ],
    "images": [],
    "description": "Protective gloves for safe riding",
    "stock": 80,
    "isFeatured": false
  },
  {
    "_id": "69fc6188f87dd69dc5aa485a",
    "name": "Car Floor Mats",
    "price": 1800,
    "category": "Accessories",
    "vehicle": [
      {
        "brand": "Hyundai",
        "model": [
          "i20",
          "Creta"
        ],
        "_id": "69fc6188f87dd69dc5aa485b"
      },
      {
        "brand": "Toyota",
        "model": [
          "Fortuner"
        ],
        "_id": "69fc6188f87dd69dc5aa485c"
      },
      {
        "brand": "Mahindra",
        "model": [
          "Bolero"
        ],
        "_id": "69fc6188f87dd69dc5aa485d"
      }
    ],
    "images": [],
    "description": "Waterproof mats for clean interiors",
    "stock": 50,
    "isFeatured": false
  },
  {
    "_id": "69fc61b7f87dd69dc5aa4860",
    "name": "Bike Helmet",
    "price": 1500,
    "category": "Accessories",
    "vehicle": [
      {
        "brand": "Universal",
        "model": [
          "Bikes"
        ],
        "_id": "69fc61b7f87dd69dc5aa4861"
      }
    ],
    "images": [],
    "description": "ISI certified helmet for rider safety",
    "stock": 32,
    "isFeatured": true
  },
  {
    "_id": "69fc6229f87dd69dc5aa4864",
    "name": "Bike Spark Plug",
    "price": 350,
    "category": "Engine",
    "vehicle": [
      {
        "brand": "Bajaj",
        "model": [
          "Pulsar N160",
          "Dominar 400"
        ],
        "_id": "69fc6229f87dd69dc5aa4865"
      }
    ],
    "images": [],
    "description": "High performance spark plug for Bajaj bikes",
    "stock": 200,
    "isFeatured": false
  },
  {
    "_id": "69fc6276f87dd69dc5aa4868",
    "name": "Car Engine Oil",
    "price": 700,
    "category": "Engine",
    "vehicle": [
      {
        "brand": "Universal",
        "model": [
          "Cars"
        ],
        "_id": "69fc6276f87dd69dc5aa4869"
      }
    ],
    "images": [],
    "description": "OEM oil for cars",
    "stock": 90,
    "isFeatured": false
  },
  {
    "_id": "69fc63fef87dd69dc5aa488b",
    "name": "Bike Piston Kit",
    "price": 2500,
    "category": "Engine",
    "vehicle": [
      {
        "brand": "Yamaha",
        "model": [
          "R15 V4",
          "FZ-S"
        ],
        "_id": "69fc63fef87dd69dc5aa488c"
      }
    ],
    "images": [],
    "description": "Complete piston kit for Yamaha performance bikes",
    "stock": 25,
    "isFeatured": true
  },
  {
    "_id": "69fc6448f87dd69dc5aa488f",
    "name": "Car Timing Belt",
    "price": 3200,
    "category": "Engine",
    "vehicle": [
      {
        "brand": "Tata Motors",
        "model": [
          "Punch",
          "Nexon"
        ],
        "_id": "69fc6448f87dd69dc5aa4890"
      }
    ],
    "images": [],
    "description": "Durable timing belt for Tata cars",
    "stock": 30,
    "isFeatured": false
  },
  {
    "_id": "69fc6477f87dd69dc5aa4893",
    "name": "Bike Carburetor",
    "price": 2800,
    "category": "Engine",
    "vehicle": [
      {
        "brand": "Hero",
        "model": [
          "Splendor Plus",
          "Glamour"
        ],
        "_id": "69fc6477f87dd69dc5aa4894"
      }
    ],
    "images": [],
    "description": "OEM carburetor for Hero commuter bikes",
    "stock": 35,
    "isFeatured": false
  }
]

export const vehicleCatalog = [
  {
    "_id": "69fa031a1625b346d6464bbc",
    "brand": "Royal Enfield",
    "model": [
      "Classic 350",
      "Bullet 350",
      "Hunter 350",
      "Continental GT 650"
    ]
  },
  {
    "_id": "69fa03511625b346d6464bcc",
    "brand": "Honda",
    "model": [
      "SP 125",
      "Shine",
      "Activa 6G",
      "CB350RS"
    ]
  },
  {
    "_id": "69fa03821625b346d6464bdc",
    "brand": "Yamaha",
    "model": [
      "R15 V4",
      "MT 15 V2",
      "FZ-S",
      "XSR 155"
    ]
  },
  {
    "_id": "69fa03b51625b346d6464bec",
    "brand": "TVS",
    "model": [
      "Apache RTR 160",
      "Raider 125",
      "Ronin",
      "Jupiter"
    ]
  },
  {
    "_id": "69fadccf027395b49ead443c",
    "brand": "Hero",
    "model": [
      "Splendor Plus",
      "HF Deluxe",
      "Glamour",
      "Xtreme 125R"
    ]
  },
  {
    "_id": "69fadd09027395b49ead444c",
    "brand": "Bajaj",
    "model": [
      "Pulsar N160",
      "Pulsar NS200",
      "Platina 110",
      "Dominar 400"
    ]
  },
  {
    "_id": "69fadd4c027395b49ead445c",
    "brand": "Maruti Suzuki",
    "model": [
      "Swift",
      "Baleno",
      "Brezza",
      "Ertiga"
    ]
  },
  {
    "_id": "69fae5cc027395b49ead4489",
    "brand": "Tata Motors",
    "model": [
      "Punch",
      "Nexon",
      "Harrier",
      "Sierra"
    ]
  },
  {
    "_id": "69fae5ef027395b49ead4491",
    "brand": "Hyundai",
    "model": [
      "Creta",
      "Venue",
      "i20",
      "Verna"
    ]
  },
  {
    "_id": "69fae5fd027395b49ead4495",
    "brand": "Mahindra",
    "model": [
      "Thar",
      "Scorpio N",
      "XUV700",
      "Bolero"
    ]
  },
  {
    "_id": "69fae60d027395b49ead4499",
    "brand": "Toyota",
    "model": [
      "Fortuner",
      "Innova Hycross",
      "Urban Cruiser Hyryder",
      "Glanza"
    ]
  },
  {
    "_id": "69fae61c027395b49ead449d",
    "brand": "Kia",
    "model": [
      "Seltos",
      "Sonet",
      "Carens",
      "EV6"
    ]
  },
  {
    "_id": "69fc5f16f87dd69dc5aa4819",
    "brand": "Universal",
    "model": [
      "Bikes",
      "Cars",
      "Engines",
      "Accessories"
    ]
  }
];

export const CATEGORY_PLACEHOLDERS = {
  Bike: [
    "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=500",
    "https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?q=80&w=500",
    "https://images.unsplash.com/photo-1502744688674-c619d1586c9e?q=80&w=500",
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=500",
  ],
  Car: [
    "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=500",
    "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=500",
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=500",
    "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500",
  ],
  Engine: [
    "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=500",
    "https://imgs.search.brave.com/2lodTy0u77NpkG4dNHWaik0GZFrbx4zHOPRHnNxO_zU/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNjcx/Nzk1NTcyL3Bob3Rv/L3Bvd2VyLWdlbmVy/YXRvci5qcGc_cz02/MTJ4NjEyJnc9MCZr/PTIwJmM9SHZXOEZU/MEllLTBzMGpEYkZH/dFNQY3ZSYVdVUWR3/WlVDcmtWaVhqOExx/dz0",
    "https://imgs.search.brave.com/zSlCRnbiybg7AYfH-cG0dZvLdrRnD66EafFI3aBbT8U/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jYXIt/cGFydHMtaXNvbGF0/ZWQtZW5naW5lLXdo/aXRlLTU5ODI1NTI1/LmpwZw",
    "https://imgs.search.brave.com/XGTQj-RIhjhCAwN8CX7w21V1YzTD5pvfKNPQnD7cEfc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzMv/NzY1LzM3Mi9zbWFs/bC9hdXRvbW90aXZl/LXBhcnRzLWFuZC10/b29scy1vbi13b3Jr/c2hvcC10YWJsZS1t/ZWNoYW5pY2FsLWVu/Z2luZWVyaW5nLXNl/cnZpY2UtYW5kLWNh/ci1yZXBhaXItZXF1/aXBtZW50LWNvbmNl/cHQtb2YtbWFpbnRl/bmFuY2UtYW5kLXRl/Y2hub2xvZ3ktcGhv/dG8uanBn"
  ],
  Accessories: [
    "https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=500",
    "https://imgs.search.brave.com/VCa42_07zuSWafn-OE0MaRJxAAa7Q_ZyKy32QFhZTLs/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5pc3RvY2twaG90/by5jb20vaWQvOTA1/MjA1NTYwL3Bob3Rv/L2Jpa2UtYWNjZXNz/b3JpZXMtYmlrZS1o/ZWxtZXQtYmlrZS1n/bG92ZXMtZXllZ2xh/c3Nlcy1ib3R0bGUt/aW4taG9sZGVyLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1s/d0pnTGNFVXVCLUx5/ZWZ4NkZBNzBnOVhy/bzBaenprajlhQ0JE/M3VOQlk4PQ",
    "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=500",
    "https://imgs.search.brave.com/XGTQj-RIhjhCAwN8CX7w21V1YzTD5pvfKNPQnD7cEfc/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzMv/NzY1LzM3Mi9zbWFs/bC9hdXRvbW90aXZl/LXBhcnRzLWFuZC10/b29scy1vbi13b3Jr/c2hvcC10YWJsZS1t/ZWNoYW5pY2FsLWVu/Z2luZWVyaW5nLXNl/cnZpY2UtYW5kLWNh/ci1yZXBhaXItZXF1/aXBtZW50LWNvbmNl/cHQtb2YtbWFpbnRl/bmFuY2UtYW5kLXRl/Y2hub2xvZ3ktcGhv/dG8uanBn",
  ],
};

export default products;
