import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/app_theme.dart';
import '../../providers/tender_provider.dart';
import '../../providers/business_provider.dart';
import '../../providers/auth_provider.dart';
import '../../models/business.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_textfield.dart';

class PlaceBidScreen extends StatefulWidget {
  final String tenderId;

  const PlaceBidScreen({super.key, required this.tenderId});

  @override
  State<PlaceBidScreen> createState() => _PlaceBidScreenState();
}

class _PlaceBidScreenState extends State<PlaceBidScreen> {
  final _formKey = GlobalKey<FormState>();
  final _amountController = TextEditingController();
  final _proposalController = TextEditingController();
  final _deliveryDaysController = TextEditingController();

  List<Business> _userBusinesses = [];
  String? _selectedBusinessId;
  bool _loadingBusinesses = true;

  @override
  void initState() {
    super.initState();
    _loadUserBusinesses();
  }

  Future<void> _loadUserBusinesses() async {
    final authProvider = context.read<AuthProvider>();
    final user = authProvider.user;

    if (user == null) {
      setState(() => _loadingBusinesses = false);
      return;
    }

    final businessProvider = context.read<BusinessProvider>();
    await businessProvider.searchBusinesses();

    setState(() {
      // Filter to show only user's businesses
      _userBusinesses = businessProvider.businesses
          .where((business) => business.ownerId == user.id)
          .toList();
      _loadingBusinesses = false;

      // Auto-select first business if only one
      if (_userBusinesses.length == 1) {
        _selectedBusinessId = _userBusinesses.first.id;
      }
    });
  }

  @override
  void dispose() {
    _amountController.dispose();
    _proposalController.dispose();
    _deliveryDaysController.dispose();
    super.dispose();
  }

  Future<void> _submitBid() async {
    if (!_formKey.currentState!.validate()) return;

    if (_selectedBusinessId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please select a business'),
          backgroundColor: AppTheme.primaryRed,
        ),
      );
      return;
    }

    final tenderProvider = context.read<TenderProvider>();
    final success = await tenderProvider.createBid(
      tenderId: widget.tenderId,
      amount: double.parse(_amountController.text),
      proposal: _proposalController.text.trim(),
      deliveryDays: int.parse(_deliveryDaysController.text),
      businessId: _selectedBusinessId!,
    );

    if (mounted) {
      if (success) {
        Navigator.of(context).pop(true);
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('✅ Bid submitted successfully! The tender owner will review your proposal.'),
            backgroundColor: AppTheme.primaryGreen,
            duration: Duration(seconds: 4),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(tenderProvider.error ?? 'Failed to submit bid'),
            backgroundColor: AppTheme.primaryRed,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final tenderProvider = context.watch<TenderProvider>();
    final tender = tenderProvider.selectedTender;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Place Bid'),
        elevation: 0,
      ),
      body: _loadingBusinesses
          ? const Center(child: CircularProgressIndicator())
          : _userBusinesses.isEmpty
              ? _buildNoBusinessesView()
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(20),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Tender info card
                        if (tender != null)
                          Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: AppTheme.background,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppTheme.border),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  tender.title,
                                  style: Theme.of(context).textTheme.titleMedium?.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.attach_money,
                                      size: 16,
                                      color: AppTheme.textSecondary,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Budget: ${tender.displayBudget}',
                                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                            color: AppTheme.textSecondary,
                                          ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),

                        const SizedBox(height: 24),

                        // Business dropdown
                        Text(
                          'Select Business',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                                color: AppTheme.textPrimary,
                              ),
                        ),
                        const SizedBox(height: 8),
                        DropdownButtonFormField<String>(
                          value: _selectedBusinessId,
                          decoration: InputDecoration(
                            prefixIcon: const Icon(Icons.business),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          hint: const Text('Choose your business'),
                          items: _userBusinesses.map((business) {
                            return DropdownMenuItem(
                              value: business.id,
                              child: Text(business.businessName),
                            );
                          }).toList(),
                          onChanged: (value) {
                            setState(() => _selectedBusinessId = value);
                          },
                          validator: (value) {
                            if (value == null) return 'Please select a business';
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),

                        CustomTextField(
                          label: 'Your Bid Amount (KES)',
                          hint: 'e.g., 75000',
                          controller: _amountController,
                          prefixIcon: Icons.monetization_on,
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter bid amount';
                            }
                            final amount = double.tryParse(value);
                            if (amount == null) {
                              return 'Please enter a valid amount';
                            }
                            if (amount <= 0) {
                              return 'Amount must be greater than 0';
                            }
                            return null;
                          },
                        ),

                        const SizedBox(height: 16),

                        CustomTextField(
                          label: 'Delivery Time (Days)',
                          hint: 'e.g., 30',
                          controller: _deliveryDaysController,
                          prefixIcon: Icons.access_time,
                          keyboardType: TextInputType.number,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter delivery time';
                            }
                            final days = int.tryParse(value);
                            if (days == null) {
                              return 'Please enter a valid number';
                            }
                            if (days <= 0) {
                              return 'Days must be greater than 0';
                            }
                            return null;
                          },
                        ),

                        const SizedBox(height: 16),

                        CustomTextField(
                          label: 'Your Proposal',
                          hint: 'Explain why you\'re the best fit for this tender...',
                          controller: _proposalController,
                          prefixIcon: Icons.description,
                          maxLines: 6,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter your proposal';
                            }
                            if (value.length < 50) {
                              return 'Proposal must be at least 50 characters';
                            }
                            return null;
                          },
                        ),

                        const SizedBox(height: 24),

                        // Info card
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryGreen.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppTheme.primaryGreen),
                          ),
                          child: Row(
                            children: [
                              const Icon(
                                Icons.info_outline,
                                color: AppTheme.primaryGreen,
                                size: 24,
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Text(
                                  'Your bid will be visible to the tender owner. Make sure to provide a competitive price and detailed proposal.',
                                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                                        color: AppTheme.primaryGreen,
                                      ),
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 32),

                        Consumer<TenderProvider>(
                          builder: (context, tenderProvider, child) {
                            return CustomButton(
                              text: 'Submit Bid',
                              onPressed: _submitBid,
                              isLoading: tenderProvider.isLoading,
                            );
                          },
                        ),

                        const SizedBox(height: 20),
                      ],
                    ),
                  ),
                ),
    );
  }

  Widget _buildNoBusinessesView() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.business_outlined,
              size: 80,
              color: AppTheme.textSecondary,
            ),
            const SizedBox(height: 24),
            Text(
              'No Business Found',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
            ),
            const SizedBox(height: 12),
            Text(
              'You need to create a business before you can place bids on tenders.',
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppTheme.textSecondary,
                  ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 32),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pushNamed('/create-business');
              },
              icon: const Icon(Icons.add),
              label: const Text('Create Business'),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.primaryGreen,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
