import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ListRenderItem,
  Platform,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList, CartItem } from '../../App'; 

type MenuScreenProps = StackScreenProps<RootStackParamList, 'Menu'>;

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
};

const MenuScreen: React.FC<MenuScreenProps> = ({ navigation, route }) => {
  const { customerName, tableNumber } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);

  const menuItems: MenuItem[] = [
    { id: 1, name: 'Milk Tart', description: 'Traditional South African custard tart', price: 45.00, category: 'Desserts', image: '🥧' },
    { id: 2, name: 'Koeksisters', description: 'Sweet braided pastry with syrup', price: 25.00, category: 'Desserts', image: '🍩' },
    { id: 3, name: 'Chocolate Cake', description: 'Rich chocolate sponge cake', price: 85.00, category: 'Cakes', image: '🍰' },
    { id: 4, name: 'Vanilla Cupcake', description: 'Fluffy vanilla cupcake with buttercream', price: 28.00, category: 'Cakes', image: '🧁' },
    { id: 5, name: 'Red Velvet', description: 'Classic red velvet with cream cheese frosting', price: 65.00, category: 'Cakes', image: '🍰' },
    { id: 6, name: 'Macarons (6pc)', description: 'Assorted French macarons', price: 95.00, category: 'Macaroons', image: '🍬' },
    { id: 7, name: 'Chocolate Macarons', description: 'Rich chocolate macarons (4pc)', price: 72.00, category: 'Macaroons', image: '🍬' },
    { id: 8, name: 'Croissant', description: 'Buttery French croissant', price: 22.00, category: 'Croissants', image: '🥐' },
    { id: 9, name: 'Almond Croissant', description: 'Croissant filled with almond cream', price: 35.00, category: 'Croissants', image: '🥐' },
    { id: 10, name: 'Chocolate Milkshake', description: 'Thick chocolate milkshake', price: 38.00, category: 'Milkshakes', image: '🥤' },
    { id: 11, name: 'Vanilla Milkshake', description: 'Classic vanilla milkshake', price: 38.00, category: 'Milkshakes', image: '🥤' },
    { id: 12, name: 'Strawberry Milkshake', description: 'Fresh strawberry milkshake', price: 41.00, category: 'Milkshakes', image: '🥤' },
    { id: 13, name: 'Caramel Milkshake', description: 'Sweet caramel milkshake', price: 41.00, category: 'Milkshakes', image: '🥤' },
    { id: 14, name: 'Cheese Cake', description: 'New York style cheesecake', price: 55.00, category: 'Desserts', image: '🍰' },
    { id: 15, name: 'Tiramisu', description: 'Classic Italian coffee dessert', price: 68.00, category: 'Desserts', image: '🍮' },
    { id: 16, name: 'Cookies (3pc)', description: 'Fresh baked chocolate chip cookies', price: 24.00, category: 'Cookies', image: '🍪' },
    { id: 17, name: 'Oatmeal Cookies', description: 'Healthy oatmeal raisin cookies (3pc)', price: 22.00, category: 'Cookies', image: '🍪' },
    { id: 18, name: 'Brownie', description: 'Fudgy chocolate brownie', price: 32.00, category: 'Desserts', image: '🍫' },
    { id: 19, name: 'Apple Pie', description: 'Warm apple pie with cinnamon', price: 48.00, category: 'Desserts', image: '🥧' },
    { id: 20, name: 'Ice Cream Scoop', description: 'Vanilla ice cream scoop', price: 18.00, category: 'Desserts', image: '🍦' },
  ];

  const categories = ['All', 'Desserts', 'Cakes', 'Macaroons', 'Croissants', 'Milkshakes', 'Cookies'];

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existing = prevCart.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const renderMenuItem: ListRenderItem<MenuItem> = ({ item }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuItemEmoji}>{item.image}</Text>
      <View style={styles.menuItemContent}>
        <Text style={styles.menuItemName}>{item.name}</Text>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>R{item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToCart(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryButton: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.activeCategoryButton
      ]}
      onPress={() => setSelectedCategory(item)}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.categoryButtonText,
        selectedCategory === item && styles.activeCategoryButtonText
      ]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {Platform.OS !== 'web' && (
        <StatusBar backgroundColor="#FF6B35" barStyle="light-content" />
      )}
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hi {customerName}!</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search menu items..."
          placeholderTextColor="#666"
        />
      </View>

      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryButton}
        keyExtractor={(item) => item}
        style={styles.categoryList}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryListContent}
      />

      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No items match your search.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          renderItem={renderMenuItem}
          keyExtractor={(item) => item.id.toString()}
          style={styles.menuList}
          contentContainerStyle={styles.menuListContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart', { cart, customerName, tableNumber })}
            activeOpacity={0.8}
          >
            <Text style={styles.cartButtonText}>
              🛒 View Cart ({totalItems} items)
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF6B35',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    color: 'white',
    fontSize: 18,
  },
  closeButton: {
    color: 'white',
    fontSize: 18,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  categoryList: {
    maxHeight: 50,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryListContent: {
    paddingRight: 16,
  },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#FF6B35',
  },
  categoryButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
  menuList: {
    flex: 1,
  },
  menuListContent: {
    padding: 16,
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  menuItemEmoji: {
    fontSize: 40,
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cartButtonContainer: {
    backgroundColor: '#FF6B35',
    padding: 16,
  },
  cartButton: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#FF6B35',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

export default MenuScreen;