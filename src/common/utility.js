import React from 'react';
import { util } from 'givebox-lib';

export const navArray = [
  { parent: 'money', name: 'Money', path: '/money', icon: 'credit-card' },
  { parent: 'fundraisers', name: 'Peer-2-Peer', path: '/fundraisers', icon: 'share-2' },
  {
    parent: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: 'sliders',
    children: [
      {
        parent: 'settings',
        child: 'myprofile',
        name: 'My Profile',
        path: '/settings/myprofile',
        fileName: 'MyAccount',
        icon: 'user'
      }
    ]
  },
];

export const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};


export const translateAlerts = (slug) => {
  const obj = {
    slug: slug,
    name: '',
    threshold: false
  };
  switch(slug) {
    case 'alert_single_donation':
      obj.name = 'Single Transaction';
      obj.label = 'Receive email notification after every transaction';
      break;

    case 'alert_daily_donations':
      obj.name = 'Daily Transactions';
      obj.label = 'Receive email notification with daily summary';
      break;

    case 'alert_monthly_donations':
      obj.name = 'Monthly Transactions';
      obj.label = 'Receive email notification with monthly summary';
      break;

    case 'alert_high_donor':
      obj.name = 'Large Transaction';
      obj.label = 'Receive email notification after every large transaction';
      obj.threshold = true;
      break;

    case 'new_volunteer':
      obj.name = 'Peer-to-Peer Alerts';
      obj.label = 'Receive notification when peer-to-peer campaigns are created';
      break;

    // no default
  }
  return obj;
}


export function kindContent(kind) {
  const obj = {};
  switch (kind) {
    case 'events':
    case 'event': {
      obj.desc =  <div className='raiseDesc'><span className='typesDesc'>
      Your all-in-one tool to organize and plan every detail of your <span className='typeDescBold'>Events</span>. From fundraising galas to golf tournaments.</span></div>;
      obj.descBottom = ['Unlimited Events', 'Automated Tickets'];
      break;
    }

    case 'fundraisers':
    case 'fundraiser': {
      obj.desc =
        <div className='raiseDesc'>
          <span className='typesDesc'>
          Your most successful tool can be <span className='typeDescBold'>Donation Forms</span> collecting money directly from your website and Facebook page.
          </span>
        </div>;
      obj.descBottom = ['Unlimited Forms', 'Automated Receipt'];
      break;
    }

    case 'invoices':
    case 'invoice': {
      obj.desc = <div className='raiseDesc'>
        <span className='typesDesc'>
          Customize professional <span className='typeDescBold'>invoices</span> in just a few clicks and send them your vendors an large donors through email.
        </span>
      </div>;
      obj.descBottom = ['Unlimited Invoices', 'Fast Payments'];
      break;
    }

    case 'memberships':
    case 'membership': {
      obj.desc = <div className='raiseDesc'><span className='typesDesc'>Engage, grow, track and measure your nonprofit organizations and associations <span className='typeDescBold'>Memberships</span> in a few simple steps.</span></div>;
      obj.descBottom = ['Unlimited Members', 'Automated Renewal']
      break;
    }

    case 'sweepstakes':
    case 'sweepstake': {
      obj.desc = <div className='raiseDesc'><span className='typesDesc'>Creating a <span className='typeDescBold'>Sweepstakes</span> campaign offers a fun, engaging way for you to boost fundraising and gather donor information.</span></div>;
      obj.descBottom = ['Unlimited Contests', 'Automated Winner'];
      break;
    }

    // no default
  }
  return obj;
}
