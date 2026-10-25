
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-sup-admin-main',
  standalone: true,
  imports: [CommonModule, Navbar],
  templateUrl: './sup-admin-main.html',
  styleUrl: './sup-admin-main.css'
})
export class SupAdminMain {

  statistics = [
    {
      title: 'Students',
      value: 0,
      icon: '♙',
      color: 'cyan'
    },
    {
      title: 'Stamps issued',
      value: 0,
      icon: '♟',
      color: 'purple'
    },
    {
      title: 'Linked accounts',
      value: 0,
      icon: '✓',
      color: 'green'
    },
    {
      title: 'Awaiting stamps',
      value: 0,
      icon: '+',
      color: 'pink'
    }
  ];

  stampTypes = [
    {
      name: 'AI Skill',
      percentage: 0,
      color: '#e88bda'
    },
    {
      name: 'AI Applied Skill',
      percentage: 0,
      color: '#8c79ff'
    },
    {
      name: 'AI Advanced Skill',
      percentage: 0,
      color: '#28c8e8'
    }
  ];

  recentStudents: {
    name: string;
    email: string;
  }[] = [];

}
