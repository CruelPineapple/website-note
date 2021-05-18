module.exports = {
    base: '/note/',
    title: 'Rice Shower',
    description: '一马当先，万马无光',
    themeConfig:{
        sidebar:{
            '/fe/':[
                '/fe/',
                {
                    title:'Vue',
                    children:[
                        '/fe/关于mounted的bug'
                    ]
                }
            ]
        },
        nav:[
            {text:'Fe',link:'/Fe/'},
            {text: 'Pretty Derby',link:'/derby/'},
            {text:'GitHub',link:'https://github.com/CruelPineapple'}         
        ]
    }
}