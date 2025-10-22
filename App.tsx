import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  ScrollView,
  ListRenderItem,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

// ------------------------------------
// 1. INTERFACE DEFINITIONS (TYPESCRIPT CORE)
// ------------------------------------

/**
 * Defines the structure for a single menu item.
 */
interface MenuItem {
  name: string;
  description: string;
  price: string; // Storing as string initially for TextInput, handle conversion on save
  course: string;
}

/**
 * Defines the structure for the translation object.
 */
interface Translations {
  [key: string]: string; // Key is language code (e.g., 'en'), value is the name
}

const App = () => {
  // ------------------------------------
  // 2. STATE WITH EXPLICIT TYPES
  // ------------------------------------
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [newItem, setNewItem] = useState<MenuItem>({ name: '', description: '', price: '', course: '' });
  const [selectedLanguage, setSelectedLanguage] = useState<keyof Translations>('en');
  const [isManagementView, setIsManagementView] = useState<boolean>(false);

  const courses: string[] = ['Starters', 'Mains', 'Dessert', 'Drinks'];

  const translations: Translations = {
    en: 'Moonlit Souls',
    el: 'Φεγγαρόφωτες Ψυχές',
    fr: 'Âmes au Clair de Lune',
    ar: 'أرواح مضيئة بالقمر',
  };

  // ------------------------------------
  // 3. HANDLERS WITH TYPESCRIPT
  // ------------------------------------

  const toggleLanguage = () => {
    const order: (keyof Translations)[] = ['en', 'el', 'fr', 'ar'];
    const nextIndex = (order.indexOf(selectedLanguage) + 1) % order.length;
    setSelectedLanguage(order[nextIndex]);
  };

  const handleSave = () => {
    if (newItem.name && newItem.description && newItem.price && newItem.course) {
      // Basic price formatting/validation
      const price = parseFloat(newItem.price).toFixed(2);
      const itemToSave: MenuItem = { ...newItem, price };
      
      setMenuItems([itemToSave, ...menuItems]);
      setNewItem({ name: '', description: '', price: '', course: '' });
      setModalVisible(false);
    }
  };

  const handleDelete = (index: number) => {
    const updated = [...menuItems];
    updated.splice(index, 1);
    setMenuItems(updated);
  };

  const handleClear = () => {
    setMenuItems([]);
  };

  // ------------------------------------
  // 4. RENDER FUNCTIONS WITH ListRenderItem TYPE
  // ------------------------------------

  const renderCustomerItem: ListRenderItem<MenuItem> = ({ item }) => (
    <View style={styles.menuCard}>
      <Text style={styles.menuTitle}>{item.name} €{item.price}</Text>
      <Text style={styles.menuDesc}>{item.description}</Text>
      <Text style={styles.menuCourse}>{item.course}</Text>
    </View>
  );

  const renderManagementItem: ListRenderItem<MenuItem> = ({ item, index }) => (
    <View style={[styles.menuCard, styles.managementCard]}>
      <View style={styles.menuCardContent}>
        <Text style={styles.menuTitle}>{item.name} €{item.price}</Text>
        <Text style={styles.menuDesc}>{item.description}</Text>
        <Text style={styles.menuCourse}>{item.course}</Text>
      </View>
      <TouchableOpacity onPress={() => index !== undefined && handleDelete(index)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
  
  // ------------------------------------
  // 5. COMPONENT RENDER
  // ------------------------------------
  return (
    <View style={styles.container}>
      {/* Top Controls */}
      <View style={styles.topControls}>
        {/* Translator Icon */}
        <TouchableOpacity style={styles.translatorIcon} onPress={toggleLanguage}>
          <Ionicons name="language" size={24} color="#fff" />
        </TouchableOpacity>
        
        {/* Management Toggle */}
        <TouchableOpacity 
          style={styles.adminToggle} 
          onPress={() => setIsManagementView(!isManagementView)}>
          <Ionicons name={isManagementView ? "restaurant" : "construct-sharp"} size={24} color="#fff" />
          <Text style={styles.adminToggleText}>{isManagementView ? 'Customer View' : 'Manager View'}</Text>
        </TouchableOpacity>
      </View>

      {/* Header Section */}
      <View style={styles.headerSection}>
        {/* Assuming ./assets/logo.png exists or you use a placeholder */}
        <Image source={require('./assets/snack-icon.png')} style={styles.logo} /> 
        <Text style={styles.appName}>{translations[selectedLanguage]}</Text>

        {/* Course Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {courses.map((course, index) => (
            <View key={index} style={styles.courseCard}>
              <Text style={styles.courseText}>{course}</Text>
              <Text style={styles.courseText}>Avg: €--</Text>
            </View>
          ))}
        </ScrollView>
      </View>
      
      {/* Menu Management Controls (Visible only in Management View) */}
      {isManagementView && (
        <View style={styles.managementControls}>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>➕ Add Menu Item</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.buttonText}>❌ Clear All Items</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Main Menu List */}
      <FlatList
        data={menuItems}
        keyExtractor={(_, index) => index.toString()}
        style={styles.flatList}
        renderItem={isManagementView ? renderManagementItem : renderCustomerItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>Menu is empty. {isManagementView ? 'Add an item!' : 'Check back later!'}</Text>
        )}
      />

      {/* Modal for Adding Item */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Dish</Text>
            <TextInput
              placeholder="Dish Name"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={newItem.name}
              onChangeText={(text: string) => setNewItem({ ...newItem, name: text })}
            />
            <TextInput
              placeholder="Description"
              placeholderTextColor="#ccc"
              style={styles.input}
              value={newItem.description}
              onChangeText={(text: string) => setNewItem({ ...newItem, description: text })}
              multiline
            />
            <TextInput
              placeholder="Price"
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="numeric"
              value={newItem.price}
              onChangeText={(text: string) => setNewItem({ ...newItem, price: text })}
            />
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={newItem.course}
                    style={styles.picker}
                    onValueChange={(value: string | unknown) => setNewItem({ ...newItem, course: value as string })}
                    mode="dropdown"
                >
                    <Picker.Item label="Select Course" value="" style={{ color: '#ccc' }} />
                    {courses.map((course, index) => (
                    <Picker.Item key={index} label={course} value={course} />
                    ))}
                </Picker>
            </View>


            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                <Text style={styles.buttonText}>Save Dish</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;

// The styles remain the same, as they are not affected by TypeScript conversion
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#122025', paddingTop: 40 },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  translatorIcon: { zIndex: 10, alignSelf: 'flex-start' },
  adminToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#09161b',
    padding: 8,
    borderRadius: 5,
  },
  adminToggleText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 14,
  },
  headerSection: { padding: 10, alignItems: 'center' },
  logo: { width: 80, height: 80, marginBottom: 10 },
  appName: { color: '#fff', fontSize: 24, textAlign: 'center', marginBottom: 10 },
  scrollView: { paddingVertical: 10, marginBottom: 10, flexDirection: 'row' },
  courseCard: { 
    backgroundColor: '#09161b', 
    paddingHorizontal: 15, 
    paddingVertical: 10, 
    borderRadius: 5, 
    marginHorizontal: 5,
    alignItems: 'center' 
  },
  courseText: { color: '#fff', fontSize: 14 },
  
  // Menu List Styling
  flatList: { 
    flex: 1, 
    backgroundColor: '#09161b', 
    borderRadius: 10, 
    padding: 10, 
    marginHorizontal: 10,
    marginBottom: 10
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
    fontSize: 16,
  },
  menuCard: { 
    backgroundColor: '#122025', 
    borderBottomWidth: 1, 
    borderBottomColor: '#333', 
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  // Management View specific card style
  managementCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuCardContent: {
    flex: 1,
  },
  menuTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  menuDesc: { color: '#ccc', fontSize: 14 },
  menuCourse: { color: '#aaa', fontSize: 12, marginTop: 5 },

  // Management Controls
  managementControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: { 
    backgroundColor: '#28a745', // Green for Add
    padding: 10, 
    borderRadius: 5, 
    flex: 1,
    marginRight: 5,
  },
  addButtonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  clearButton: { 
    backgroundColor: '#dc3545', // Red for Clear All
    padding: 10, 
    borderRadius: 5, 
    flex: 1,
    marginLeft: 5,
  },
  deleteButton: { 
    backgroundColor: '#dc3545', // Red for Delete
    padding: 10, 
    borderRadius: 5, 
    marginLeft: 10 
  },
  buttonText: { color: '#fff', textAlign: 'center' },

  // Modal Styling
  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'center' },
  modalContent: { backgroundColor: '#09191B', margin: 20, padding: 20, borderRadius: 10 },
  modalTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  input: { 
    backgroundColor: '#122025', 
    color: '#fff', 
    padding: 10, 
    marginBottom: 10, 
    borderRadius: 5,
    minHeight: 40,
  },
  pickerContainer: {
    backgroundColor: '#122025',
    borderRadius: 5,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: { 
    color: '#fff', 
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  saveButton: { 
    backgroundColor: '#28a745', 
    padding: 12, 
    borderRadius: 5, 
    flex: 1, 
    marginRight: 5 
  },
  cancelButton: { 
    backgroundColor: '#6c757d', 
    padding: 12, 
    borderRadius: 5, 
    flex: 1, 
    marginLeft: 5 
  },
});