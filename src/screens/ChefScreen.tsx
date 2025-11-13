import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Alert,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

type Props = StackScreenProps<RootStackParamList, 'Chef'>;

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  customerName: string;
  tableNumber: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready';
  timestamp: string;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

type MenuForm = {
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
};

const ChefScreen: React.FC<Props> = ({ navigation }) => {
  const [view, setView] = useState<'orders' | 'menu'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Milk Tart', description: 'Traditional custard tart', price: 45.0, category: 'Desserts', image: '🥧' },
    { id: 2, name: 'Koeksisters', description: 'Sweet braided pastry', price: 25.0, category: 'Desserts', image: '🍩' },
    { id: 3, name: 'Chocolate Cake', description: 'Rich chocolate sponge', price: 85.0, category: 'Cakes', image: '🍰' },
  ]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuForm>({
    name: '',
    description: '',
    price: '',
    category: 'Desserts',
    image: '🍰',
  });
  const [nextId, setNextId] = useState<number>(4);

  const categories = ['Desserts', 'Cakes', 'Macaroons', 'Croissants', 'Milkshakes', 'Food', 'Cookies'];
  const emojis = ['🍰', '🥧', '🍩', '🧁', '🍪', '🥐', '🍞', '🥟', '🥤', '☕'];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1 && orders.length < 5) {
        const newOrder: Order = {
          id: Date.now(),
          customerName: `Customer ${Math.floor(Math.random() * 100)}`,
          tableNumber: `Table ${Math.floor(Math.random() * 20) + 1}`,
          items: [
            { name: 'Milk Tart', quantity: 2, price: 45 },
            { name: 'Chocolate Cake', quantity: 1, price: 85 },
          ],
          status: 'pending',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        };
        setOrders(prev => [newOrder, ...prev.slice(0, 4)]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [orders.length]);

  const updateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const addMenuItem = () => {
    if (!form.name || !form.description || !form.price) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const newItem: MenuItem = {
      id: nextId,
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      image: form.image,
    };

    setMenuItems(prev => [...prev, newItem]);
    setNextId(prev => prev + 1);
    setForm({ name: '', description: '', price: '', category: 'Desserts', image: '🍰' });
    Alert.alert('Success', 'Menu item added successfully!');
  };

  const updateMenuItem = () => {
    if (!form.name || !form.description || !form.price || !editing) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setMenuItems(prev =>
      prev.map(item =>
        item.id === editing.id
          ? {
              ...item,
              name: form.name,
              description: form.description,
              price: parseFloat(form.price),
              category: form.category,
              image: form.image,
            }
          : item
      )
    );

    setEditing(null);
    setForm({ name: '', description: '', price: '', category: 'Desserts', image: '🍰' });
    Alert.alert('Success', 'Menu item updated successfully!');
  };

  const deleteMenuItem = (id: number) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setMenuItems(prev => prev.filter(item => item.id !== id)),
      },
    ]);
  };

  const startEdit = (item: MenuItem) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image,
    });
  };

  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: '', description: '', price: '', category: 'Desserts', image: '🍰' });
  };

  const getOrderStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return styles.pendingOrder;
      case 'preparing':
        return styles.preparingOrder;
      case 'ready':
        return styles.readyOrder;
      default:
        return {};
    }
  };

  const renderOrder = ({ item: order }: { item: Order }) => {
    const total = order.items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    return (
      <View style={[styles.orderCard, getOrderStatusStyle(order.status)]}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>Order #{order.id}</Text>
            <Text style={styles.orderInfo}>
              {order.customerName} • Table {order.tableNumber} • {order.timestamp}
            </Text>
          </View>
          <Text style={styles.orderTotal}>R{total.toFixed(2)}</Text>
        </View>

        <View style={styles.orderItems}>
          {order.items.map((it, idx) => (
            <View key={idx} style={styles.orderItem}>
              <Text style={styles.orderItemText}>{it.quantity}x {it.name}</Text>
              <Text style={styles.orderItemPrice}>R{(it.price * it.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.statusButtons}>
          {order.status === 'pending' && (
            <TouchableOpacity style={styles.preparingButton} onPress={() => updateOrderStatus(order.id, 'preparing')}>
              <Text style={styles.buttonText}>⏱ Start Preparing</Text>
            </TouchableOpacity>
          )}
          {order.status === 'preparing' && (
            <TouchableOpacity style={styles.readyButton} onPress={() => updateOrderStatus(order.id, 'ready')}>
              <Text style={styles.buttonText}>✓ Mark Ready</Text>
            </TouchableOpacity>
          )}
          {order.status === 'ready' && (
            <View style={styles.readyStatus}>
              <Text style={styles.readyStatusText}>Ready for Pickup</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItemCard}>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemEmoji}>{item.image}</Text>
        <View style={styles.menuItemDetails}>
          <Text style={styles.menuItemName}>{item.name}</Text>
          <Text style={styles.menuItemDescription}>{item.description}</Text>
          <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)} • {item.category}</Text>
        </View>
      </View>
      <View style={styles.menuItemActions}>
        <TouchableOpacity style={styles.editButton} onPress={() => startEdit(item)}>
          <Text style={styles.editButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteMenuItem(item.id)}>
          <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS !== 'web' && (
        <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />
      )}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👨‍🍳 Chef Dashboard</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity style={[styles.tab, view === 'orders' && styles.activeTab]} onPress={() => setView('orders')}>
          <Text style={[styles.tabText, view === 'orders' && styles.activeTabText]}>
            Orders ({orders.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, view === 'menu' && styles.activeTab]} onPress={() => setView('menu')}>
          <Text style={[styles.tabText, view === 'menu' && styles.activeTabText]}>Manage Menu</Text>
        </TouchableOpacity>
      </View>

      {view === 'orders' ? (
        <FlatList
          data={orders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyOrders}>
              <Text style={styles.emptyOrdersText}>No orders yet 🥳</Text>
            </View>
          }
        />
      ) : (
        <ScrollView contentContainerStyle={styles.menuScrollContent}>
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>{editing ? 'Edit Menu Item' : 'Add Menu Item'}</Text>
            <TextInput
              placeholder="Name"
              style={styles.input}
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
            />
            <TextInput
              placeholder="Description"
              style={styles.input}
              value={form.description}
              onChangeText={text => setForm({ ...form, description: text })}
            />
            <TextInput
              placeholder="Price (e.g. 45.00)"
              keyboardType="numeric"
              style={styles.input}
              value={form.price}
              onChangeText={text => setForm({ ...form, price: text })}
            />
            <TextInput
              placeholder="Category"
              style={styles.input}
              value={form.category}
              onChangeText={text => setForm({ ...form, category: text })}
            />
            <TextInput
              placeholder="Emoji (e.g. 🍰)"
              style={styles.input}
              value={form.image}
              onChangeText={text => setForm({ ...form, image: text })}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={editing ? updateMenuItem : addMenuItem}
            >
              <Text style={styles.buttonText}>{editing ? 'Update Item' : 'Add Item'}</Text>
            </TouchableOpacity>
            {editing && (
              <TouchableOpacity
                onPress={cancelEdit}
                style={[styles.addButton, { backgroundColor: '#aaa', marginTop: 8 }]}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={item => item.id.toString()}
            style={styles.menuList}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    fontSize: 20,
    color: '#FFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#FFECD1',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  activeTab: {
    backgroundColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    color: '#333',
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  listContent: {
    padding: 16,
  },
  orderCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  pendingOrder: {
    borderLeftWidth: 5,
    borderLeftColor: '#FFA500',
  },
  preparingOrder: {
    borderLeftWidth: 5,
    borderLeftColor: '#1E90FF',
  },
  readyOrder: {
    borderLeftWidth: 5,
    borderLeftColor: '#32CD32',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderInfo: {
    fontSize: 14,
    color: '#666',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  orderItems: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  orderItemText: {
    fontSize: 14,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  statusButtons: {
    marginTop: 12,
  },
  preparingButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  readyButton: {
    backgroundColor: '#32CD32',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  readyStatus: {
    padding: 10,
    alignItems: 'center',
  },
  readyStatusText: {
    fontSize: 16,
    color: '#32CD32',
    fontWeight: 'bold',
  },
  menuScrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  menuItemCard: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  menuItemActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  editButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyOrdersText: {
    fontSize: 18,
    color: '#999',
  },
  menuList: {
    maxHeight: 400,
  },
});

export default ChefScreen;