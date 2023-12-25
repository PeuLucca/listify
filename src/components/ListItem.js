// Core
import React from 'react';
import { View } from 'react-native';
import { ListItem as ListItemComponent } from 'react-native-elements'

const ListItem = () => {
    const itens = [
        {
          name: 'Amy Farha',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
          subtitle: 'Vice President'
        },
        {
          name: 'Chris Jackson',
          avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
          subtitle: 'Vice Chairman'
        },
    ];

    return(
        <View>
            {
                itens.map((l, i) => (
                    <ListItemComponent
                        key={i}
                        leftAvatar={{ source: { uri: l.avatar_url } }}
                        title={l.name}
                        subtitle={l.subtitle}
                        bottomDivider
                    />
                ))
            }
        </View>
    );
};

export default ListItem;