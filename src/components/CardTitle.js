import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

export default function CardTitle({content, title}) {
  return (
    <Card sx={{ maxWidth: '100%' }} className='!h-full'>
      <CardActionArea className='!h-[88%]'>
        <CardContent >
          {content}
        </CardContent>
      </CardActionArea>
      <CardActions className=' !bg-black'>
        <Button size="small" color="primary" className='!capitalize !text-white'>
          {title}
        </Button>
      </CardActions>
    </Card>
  );
}
