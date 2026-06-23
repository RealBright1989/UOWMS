import { User, WasteReport, Notification, ActivityLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'Bright Okon',
    email: 'brightokon444@gmail.com',
    role: 'student',
    matricNumber: 'U/2021/ENG/0441',
    phoneNumber: '+234 812 345 6789',
    faculty: 'Engineering',
    department: 'Civil Engineering',
    hostel: 'Hostel Block C, Room 14',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u2',
    name: 'Emeka Obi',
    email: 'emeka.obi@unicross.edu.ng',
    role: 'staff',
    phoneNumber: '+234 803 987 6543',
    department: 'Campus Environmental Services',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u3',
    name: 'Asari Bassey',
    email: 'asari.bassey@unicross.edu.ng',
    role: 'staff',
    phoneNumber: '+234 705 444 3322',
    department: 'Sanitation Division Team B',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u4',
    name: 'Prof. Florence Effiong',
    email: 'florence.effiong@unicross.edu.ng',
    role: 'admin',
    phoneNumber: '+234 802 000 1122',
    faculty: 'Physical Sciences',
    department: 'Environmental Management',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u5',
    name: 'David Chidi',
    email: 'david.chidi@unicross.edu.ng',
    role: 'student',
    matricNumber: 'U/2022/SCI/1089',
    phoneNumber: '+234 901 222 3344',
    faculty: 'Biological Sciences',
    department: 'Microbiology',
    hostel: 'Off-Campus, Calabar Rd',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u6',
    name: 'Mercy Edet',
    email: 'mercy.edet@student.unicross.edu.ng',
    role: 'student',
    matricNumber: 'U/2023/LAW/0122',
    phoneNumber: '+234 809 111 2222',
    faculty: 'Law',
    department: 'Commercial Law',
    hostel: 'Female Hostel Block B, Room 5',
    status: 'Pending',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  }
];

export const INITIAL_REPORTS: WasteReport[] = [
  {
    id: 'R-7092',
    category: 'Plastic',
    priority: 'High',
    location: {
      faculty: 'Faculty of Engineering',
      building: 'Mechanical Laboratory Square',
      latitude: 4.9754,
      longitude: 8.3512,
      details: 'Piles of empty water bottles and styrofoam take-away boxes behind the lab staircase blocking access.'
    },
    description: 'Huge accumulation of plastics discarded after the departmental student congress meeting. Highly visible and messy.',
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80',
    status: 'In Progress',
    dateSubmitted: '2026-06-16T10:30:00Z',
    assignedStaffId: 'u2',
    assignedStaffName: 'Emeka Obi',
    studentId: 'u1',
    studentName: 'Bright Okon',
    comments: [
      {
        id: 'c1',
        author: 'Emeka Obi',
        authorRole: 'staff',
        content: 'I have inspected the area and requested a utility cart to transport this pile to the municipal compactor. Will clear by noon.',
        timestamp: '2026-06-16T14:15:00Z'
      },
      {
        id: 'c2',
        author: 'Prof. Florence Effiong',
        authorRole: 'admin',
        content: 'Please expedite this collection as the Dean is conducting an inspection later today. Thanks, Emeka.',
        timestamp: '2026-06-16T15:00:00Z'
      }
    ],
    aiClassification: {
      confidence: 0.96,
      handlingTip: 'Plastics are heavily recyclable. Ensure sorted into the green cage bin outside building 4.',
      recyclePotential: 'High',
      greenTip: 'UNICROSS generates roughly 300kg of single-use plastics daily. Source separation could fund local cleanups!'
    }
  },
  {
    id: 'R-2210',
    category: 'Organic',
    priority: 'Low',
    location: {
      faculty: 'Biological Sciences',
      building: 'Botanical Gardens Research Area',
      latitude: 4.9760,
      longitude: 8.3520,
      details: 'Piles of wet leaves, agricultural soil waste, and branches stacked near the greenhouse fence.'
    },
    description: 'Pruning wastes from botany practical experiments. Not urgent but occupies valuable pedestrian space.',
    imageUrl: 'https://images.unsplash.com/photo-1592182248563-6e32bc4f3d1b?auto=format&fit=crop&w=600&q=80',
    status: 'Pending',
    dateSubmitted: '2026-06-17T08:15:00Z',
    studentId: 'u5',
    studentName: 'David Chidi',
    comments: [],
    aiClassification: {
      confidence: 0.94,
      handlingTip: 'Suitable for immediate composting. Alert the Department of Crop Sciences laboratory technician.',
      recyclePotential: 'High',
      greenTip: 'Organics decompose to make superb hummus. Feeding campus-grown plants can cut maintenance costs by 15%!'
    }
  },
  {
    id: 'R-8012',
    category: 'Electronic',
    priority: 'Emergency',
    location: {
      faculty: 'Computer Sciences / IT Center',
      building: 'Networking Server Room Backdoor',
      latitude: 4.9749,
      longitude: 8.3498,
      details: 'Leaking dry batteries and broken circuit boards discarded on wet soil directly under rainfall.'
    },
    description: 'Severe hazard! Old computer batteries are leaking battery acids onto the ground. This poses a toxic threat and is next to the primary campus walkway.',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    status: 'Assigned',
    dateSubmitted: '2026-06-17T11:45:00Z',
    assignedStaffId: 'u3',
    assignedStaffName: 'Asari Bassey',
    studentId: 'u1',
    studentName: 'Bright Okon',
    comments: [
      {
        id: 'c3',
        author: 'Prof. Florence Effiong',
        authorRole: 'admin',
        content: 'EMERGENCY: Toxic materials identified near pedestrian paths. Asari Bassey, please equip acid-resistant gloves and dispatch immediately.',
        timestamp: '2026-06-17T12:00:00Z'
      }
    ],
    aiClassification: {
      confidence: 0.98,
      handlingTip: 'HAZARDOUS MATERIALS: High lithium and cadmium exposure risk. Isolate from contact and keep dry.',
      recyclePotential: 'Medium',
      greenTip: 'Leaked commercial battery mercury and lead forever poison local groundwater reserves.'
    }
  },
  {
    id: 'R-1144',
    category: 'Paper',
    priority: 'Medium',
    location: {
      faculty: 'Arts & Humanities',
      building: 'Main Library Reading Room Wing',
      latitude: 4.9751,
      longitude: 8.3508,
      details: 'Huge pile of discarded print registers, damaged textbook covers, and cartons near the main trash chute.'
    },
    description: 'Library archive clean-up resulted in excess boxes of papers left outside bins. High risk of blowing around with the evening tropical wind.',
    imageUrl: 'https://images.unsplash.com/photo-1603501047041-2d15c8ed1e8a?auto=format&fit=crop&w=600&q=80',
    status: 'Completed',
    dateSubmitted: '2026-06-15T09:00:00Z',
    assignedStaffId: 'u2',
    assignedStaffName: 'Emeka Obi',
    studentId: 'u5',
    studentName: 'David Chidi',
    completionImageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
    comments: [
      {
        id: 'c4',
        author: 'Emeka Obi',
        authorRole: 'staff',
        content: 'Bags loaded onto trucks and compressed at the recycling warehouse. Job fully cleared.',
        timestamp: '2026-06-15T15:30:00Z'
      }
    ],
    aiClassification: {
      confidence: 0.94,
      handlingTip: 'Paper must be kept flat and bone dry to safeguard high-quality pulp fibers during mechanical recycling.',
      recyclePotential: 'High',
      greenTip: 'One ton of reclaimed office paper saves enough electrical energy to power an average academic office building for 6 months!'
    }
  },
  {
    id: 'R-6650',
    category: 'Glass',
    priority: 'High',
    location: {
      faculty: 'Engineering',
      building: 'Physics Laboratory B Entrance',
      latitude: 4.9755,
      longitude: 8.3510,
      details: 'Broken chemical test tubes, glass slides, and jars shattered on building porch stairs.'
    },
    description: 'Hazardous broken glass. Needs immediate sweeping as students are walking through with sandals. Some pieces are extremely sharp.',
    imageUrl: 'https://images.unsplash.com/photo-1549488497-640aae90bc1f?auto=format&fit=crop&w=600&q=80',
    status: 'Completed',
    dateSubmitted: '2026-06-14T14:02:00Z',
    assignedStaffId: 'u3',
    assignedStaffName: 'Asari Bassey',
    studentId: 'u5',
    studentName: 'David Chidi',
    completionImageUrl: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
    comments: [
      {
        id: 'c5',
        author: 'Asari Bassey',
        authorRole: 'staff',
        content: 'Pore area swept clean, shards isolated in protective heavy-duty disposal bucket. Safety restored.',
        timestamp: '2026-06-14T16:10:00Z'
      }
    ],
    aiClassification: {
      confidence: 0.92,
      handlingTip: 'BROKEN GLASS: Dangerous debris. Keep separate, label bag, and alert collectors directly to avoid puncture injuries.',
      recyclePotential: 'High',
      greenTip: 'Shattered glass recycled is melted at 30% lower temperatures than brand new raw sand materials!'
    }
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    title: 'Waste Collection Completed',
    message: 'Your reported issue (R-1144) regarding library paper waste has been completed by Emeka Obi.',
    timestamp: '2026-06-15T15:30:00Z',
    read: false,
    type: 'success'
  },
  {
    id: 'n2',
    title: 'New Task Assignment',
    message: 'Staff Emeka Obi: You received a new task (R-7092) for Mechanical Laboratory plastics pickup.',
    timestamp: '2026-06-16T12:00:00Z',
    read: false,
    type: 'info'
  },
  {
    id: 'n3',
    title: 'Emergency Waste Report Created',
    message: 'ADMIN ALERT: Battery leak emergency (R-8012) reported at Computer Science Server wing.',
    timestamp: '2026-06-17T11:45:00Z',
    read: true,
    type: 'error'
  },
  {
    id: 'n4',
    title: 'System Access Approved',
    message: 'Your UNICROSS OCWMS account has been successfully configured and activated.',
    timestamp: '2026-06-14T08:00:00Z',
    read: true,
    type: 'success'
  }
];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act1',
    action: 'Status Completed',
    user: 'Emeka Obi',
    role: 'Staff',
    timestamp: '2026-06-15T15:30:00Z',
    details: 'Cleared 4 bags of archive papers from Main Library Reading Area.'
  },
  {
    id: 'act2',
    action: 'Task Assigned',
    user: 'Admin System',
    role: 'System',
    timestamp: '2026-06-16T12:00:00Z',
    details: 'Automatically assigned report R-7092 (Mechanical Lab plastics) to collector Emeka Obi.'
  },
  {
    id: 'act3',
    action: 'Emergency Dispatch',
    user: 'Prof. Florence Effiong',
    role: 'Admin',
    timestamp: '2026-06-17T12:00:00Z',
    details: 'Dispatched emergency task R-8012 (acid batteries leakage) with priority tools to Asari Bassey.'
  },
  {
    id: 'act4',
    action: 'New Report Created',
    user: 'Bright Okon',
    role: 'Student',
    timestamp: '2026-06-17T11:45:00Z',
    details: 'Created emergency electronics hazardous report at Computer Science Block.'
  }
];
