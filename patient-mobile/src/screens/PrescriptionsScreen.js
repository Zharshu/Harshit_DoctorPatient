import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import api from '../services/api';

const PrescriptionsScreen = ({ navigation }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await api.get('/prescriptions');
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      Alert.alert('Error', 'Failed to load prescriptions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPrescriptions();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const renderPrescription = ({ item }) => (
    <View style={styles.prescriptionCard}>
      <View style={styles.prescriptionHeader}>
        <Text style={styles.doctorName}>Dr. {item.doctor.name}</Text>
        <Text style={styles.date}>{formatDate(item.prescriptionDate)}</Text>
      </View>
      
      <View style={styles.prescriptionDetails}>
        <Text style={styles.specialization}>{item.doctor.specialization}</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms:</Text>
          <Text style={styles.sectionContent}>{item.symptoms}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Diagnosis:</Text>
          <Text style={styles.sectionContent}>{item.diagnosis}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Medicines:</Text>
          {item.medicines.map((medicine, index) => (
            <View key={index} style={styles.medicineItem}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
              <Text style={styles.medicineDetails}>
                Dosage: {medicine.dosage} | Duration: {medicine.duration}
              </Text>
              {medicine.instructions && (
                <Text style={styles.medicineInstructions}>
                  Instructions: {medicine.instructions}
                </Text>
              )}
            </View>
          ))}
        </View>

        {item.additionalNotes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Notes:</Text>
            <Text style={styles.sectionContent}>{item.additionalNotes}</Text>
          </View>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading prescriptions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={prescriptions}
        renderItem={renderPrescription}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No prescriptions found</Text>
            <Text style={styles.emptySubtext}>
              Your prescriptions will appear here after your appointments are completed.
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => navigation.navigate('Doctors')}
            >
              <Text style={styles.bookButtonText}>Book an Appointment</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  listContainer: {
    padding: 15,
  },
  prescriptionCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  date: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  prescriptionDetails: {
    marginTop: 10,
  },
  specialization: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  medicineItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db',
  },
  medicineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  medicineDetails: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  medicineInstructions: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#7f8c8d',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  bookButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrescriptionsScreen;
