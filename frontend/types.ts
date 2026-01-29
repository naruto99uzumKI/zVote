import React from 'react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: React.FC<any>;
}

export interface Step {
  number: string;
  title: string;
  description: string;
}