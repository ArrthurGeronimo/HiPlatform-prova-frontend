import { ThemeProviderProps } from '@chakra-ui/react'

const global = {
  global: (props: ThemeProviderProps) => ({
    'html, body': {
      fontWeight: '100',
    },
    nav: {
      //backgroundColor: mode('whiteAlpha.900', 'gray.800')(props),
    },
    '.tree': {
      position: 'relative',
      fontSize: '1rem',
      fontWeight: 400,
      //lineHeight: 1,
      '& ul': {
        paddingLeft: '5px',
        listStyle: 'none',
      },
      '& li': {
        fontFamily: 'Roboto Condensed',
        position: 'relative',
        paddingTop: '5px',
        paddingBottom: '5px',
        paddingLeft: '10px',
        '-webkit-box-sizing': 'border-box',
        '-moz-box-sizing': 'border-box',
        'box-sizing': 'border-box',
      },
      '& li:before': {
        position: 'absolute',
        top: '16px',
        left: 0,
        width: '10px',
        height: '1px',
        margin: 'auto',
        content: '""',
        backgroundColor: '#666',
      },
      '& li:after': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '1px',
        height: '100%',
        content: '""',
        backgroundColor: '#666',
      },
      '& li:last-child': {
        paddingBottom: '0px',
      },
      '& li:last-child:before': {
        position: 'absolute',
        top: '17px',
        left: 0,
        width: '10px',
        height: '1px',
        margin: 'auto',
        content: '""',
        backgroundColor: '#666',
      },
      '& li:last-child:after': {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '1px',
        height: '60%',
        content: '""',
        backgroundColor: '#666',
      },
      '& li.has-children': {
        cursor: 'pointer',
        position: 'relative',
      },
      '& li.has-children:before': {
        content: '"/\f107"',
        color: '#F3F3F4',
        position: 'absolute',
        fontFamily: 'FontAwesome',
        fontSize: '26px',
        right: '15px',
      },
      '& label:after': {
        position: 'absolute',
        top: 0,
        left: '-1.5em',
        display: 'block',
        height: '0.5em',
        width: '1em',
        borderBottom: '1px solid #777',
        borderLeft: '1px solid #777',
        borderRadius: '0 0 0 .3em',
        content: '""',
      },
    },
  }),
}

export default global

/* 

    'li > ul': {
      display: 'none',
    },
    'li.open > ul': {
      display: 'block',
    },

    '& li:hover': {
        backgroundColor: 'blue',
        '& li': {
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'blue',
            '& li': {
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'blue',
                '& li': {
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'blue',
                    '& li': {
                      backgroundColor: 'white',
                      '&:hover': {
                        backgroundColor: 'blue',
                        '& li': {
                          backgroundColor: 'white',
                          '&:hover': {
                            backgroundColor: 'blue',
                            '& li': {
                              backgroundColor: 'white',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

*/
